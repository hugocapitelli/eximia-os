"""
Benchmark CLI - Command-line interface for running benchmarks

Usage:
    python -m eximia_runtime.benchmarks.cli --all
    python -m eximia_runtime.benchmarks.cli --category scheduler
    python -m eximia_runtime.benchmarks.cli --benchmark trie_insert_performance
"""

import argparse
import asyncio
import sys

from eximia_runtime.benchmarks.suite import (
    BenchmarkSuite,
    BenchmarkCategory,
    run_benchmarks,
)


def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description="eximIA.OS Benchmark Suite",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  Run all benchmarks:
    python -m eximia_runtime.benchmarks.cli --all

  Run specific category:
    python -m eximia_runtime.benchmarks.cli --category scheduler
    python -m eximia_runtime.benchmarks.cli --category memory

  Run specific benchmark:
    python -m eximia_runtime.benchmarks.cli --benchmark trie_insert_performance

  Available categories:
    scheduler, context, memory, agent, end_to_end, stress
        """,
    )

    parser.add_argument(
        "--all",
        action="store_true",
        help="Run all benchmarks",
    )

    parser.add_argument(
        "--category",
        "-c",
        type=str,
        choices=[c.value for c in BenchmarkCategory],
        help="Run benchmarks in a specific category",
    )

    parser.add_argument(
        "--benchmark",
        "-b",
        type=str,
        help="Run a specific benchmark by name",
    )

    parser.add_argument(
        "--list",
        "-l",
        action="store_true",
        help="List all available benchmarks",
    )

    parser.add_argument(
        "--output",
        "-o",
        type=str,
        help="Output filename for results (default: auto-generated)",
    )

    parser.add_argument(
        "--no-export",
        action="store_true",
        help="Don't export results to file",
    )

    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Enable verbose output",
    )

    return parser.parse_args()


def list_benchmarks():
    """List all available benchmarks"""
    suite = BenchmarkSuite(verbose=False)

    print("\nAvailable Benchmarks:")
    print("=" * 60)

    by_category = {}
    for name, config in suite._benchmarks.items():
        category = config.category.value
        if category not in by_category:
            by_category[category] = []
        by_category[category].append(name)

    for category, benchmarks in sorted(by_category.items()):
        print(f"\n{category.upper()}:")
        for bench in sorted(benchmarks):
            print(f"  - {bench}")

    print("\n" + "=" * 60)


async def main():
    """Main entry point"""
    args = parse_args()

    if args.list:
        list_benchmarks()
        return 0

    suite = BenchmarkSuite(verbose=args.verbose)

    if args.all:
        print("\nRunning all benchmarks...")
        results = await suite.run_all()

    elif args.category:
        category = BenchmarkCategory(args.category)
        print(f"\nRunning {args.category} benchmarks...")
        results = await suite.run_category(category)

    elif args.benchmark:
        print(f"\nRunning benchmark: {args.benchmark}")
        result = await suite.run_benchmark(args.benchmark)
        if not result:
            print(f"Benchmark '{args.benchmark}' not found.")
            list_benchmarks()
            return 1
        results = [result]

    else:
        print("No benchmark specified. Use --all, --category, or --benchmark.")
        print("Use --list to see available benchmarks.")
        return 1

    # Print summary
    suite.print_summary()

    # Export if requested
    if not args.no_export:
        output_path = suite.export_results(args.output)
        print(f"Results exported to: {output_path}")

    # Return exit code based on results
    failed = sum(1 for r in results if r.status.value == "failed")
    return 1 if failed > 0 else 0


if __name__ == "__main__":
    try:
        exit_code = asyncio.run(main())
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\nBenchmark interrupted.")
        sys.exit(130)
