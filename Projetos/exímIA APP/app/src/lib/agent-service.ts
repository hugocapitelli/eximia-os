/**
 * ExímIA Agent Service Client
 *
 * Client for communicating with the FastAPI Agent Service backend.
 */

const AGENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_AGENT_SERVICE_URL || "http://localhost:8000";

interface HealthResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
}

interface DetailedHealthResponse extends HealthResponse {
  dependencies: Record<string, string>;
}

interface AgentServiceError {
  detail: string;
  status: number;
}

class AgentServiceClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string = AGENT_SERVICE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set the access token for authenticated requests
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Clear the access token
   */
  clearAccessToken(): void {
    this.accessToken = null;
  }

  /**
   * Make a request to the Agent Service
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: AgentServiceError = await response.json().catch(() => ({
        detail: "Unknown error",
        status: response.status,
      }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Check if the Agent Service is healthy
   */
  async healthCheck(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  /**
   * Get detailed health including dependencies
   */
  async detailedHealthCheck(): Promise<DetailedHealthResponse> {
    return this.request<DetailedHealthResponse>("/api/v1/health/detailed");
  }

  /**
   * Check if the service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.status === "ok";
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const agentService = new AgentServiceClient();

// Export class for custom instances
export { AgentServiceClient };
export type { HealthResponse, DetailedHealthResponse, AgentServiceError };
