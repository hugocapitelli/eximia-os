/**
 * Seed script to migrate data from constants.ts to Supabase database
 * Run this script once to populate your Supabase database with initial data
 * 
 * Usage: node database/seed.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Static data from constants.ts
const BOOKS_DATA = [
    // Personal Development
    { title: "Atomic Habits", author: "James Clear", category: "Personal Development", status: "reading", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-yile37CIZBXYeiyEKTX3BUBzDEUoSQvq_EShXd4-HKKD7XjnTAJi2PCr5dRjuo2waiLJY1mfkoH7ZvVLm0TIfhvRWKsQNc3jfyDFO0A8m01SD7qPamfCV-OgwzOTmwRukt25PcOxN9Z5hRzNtrBoC7ikHh9ADWRZCxB-eDOV_K07O9vbvRp5cSx3C-SIGHL5ydRtzBdoVRUtDchXQk5YzOgMdhAWyzZVlSjRJicUxGtZTw1Pv7inGWGc6eG5_QsbB4-BDqhEuk" },
    { title: "Mindset", author: "Carol S. Dweck", category: "Personal Development", status: "loaned", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdRXUgVJbCx2nRnWQuPX_L6m0xts4vyYa9g9QMNeuyZgaB0BDo9KxsgYtwCOXaM3adwUpWG4supyZ4NdJ30KtYIu-b6c0jUayT1RsuRLWoeEu7ItOMyH2C_pClBXedwNDeJqraefmDBCZITVETQG5YMmDs804rNZUfnJ9AYKz3T5bJm4Qz_sUa66b4DITYB2fggNZnuvbGQslsUF_gQM2Z3Gm_VI6-0CLfhYKDh4Q1h-q2QEZo1tUweeHZiBRR-nLtZl4JhtCs4KQ" },
    { title: "Deep Work", author: "Cal Newport", category: "Personal Development", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBllnnoYRsPAeURtON3QnspndGD4v5NUnw1yd1D_l0-Lmt_Cpx-BH07Yl2jh3Y13x7tCZYn7BY1DkUQX6MVq1WHpTSGqtiEgY2OL1wP059ci0yQr-xciOoNoXlNkuatigqIkpgrS5y-cI_RaYiyzkf10xFMFjYnTWrHV6gbnpc8DU5XEb2h8Hx5rWauiruzxciunY8-ZzxPcdDfF-O0EOQpE_LNzOlmIDa5stFqcp9EIlP0yg-xbvMJ23K3G6umRfmQybRKVFUZPRc" },
    { title: "The Power of Habit", author: "Charles Duhigg", category: "Personal Development", status: "loaned", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQqGoWN5AuU6KOW9yN5tO_FCeMQSISs1TtHbR0FIw_3KyDCg56cn1qZ17RocYbm9WM7YgitDZx_9sgVqeFWwuQiiXn3Cwc4kG859NIYVh3Ha7pR3H7Z_3yaHZuk9VVGAmqUpHC6GBJWlwXKuJNGIFuVBVPM8hpF_HFZ1X5yQ2Hk8tEzS8d22grwnparBqBS6c6dVeh4hrgcRhhnCMT9pieoBU31_FhHLVYb4b5jsh9gwkJzmNFi9Ui6mczVCvZiFXa-k6R0HF1FiE" },
    { title: "Grit", author: "Angela Duckworth", category: "Personal Development", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWHcu2iMoQlgwcMk3MPXElhNYDFNnMnFYZgyqFU77paUCOVgaF7mtNyg6fPVlT7Tp1Eg6ofzhMehF6Ndv_xPSrquEjRCdrS6LijIFYHBAJoNsqYIRzKuFI7XwXqideDYDfVBOSpggoNM5HP2hIbcd7euJxyMTIMnUxtApzg8QF_gC0uPrggvcWeHx_0nW6b6CbMblJ-D8_hXqZ1cxG6GY4BsXisD60ys3mfSGJPfw-AiRY6Fi2G7olEVZWIfzQMDqnFehjBn6Zc3I" },
    { title: "Essentialism", author: "Greg McKeown", category: "Personal Development", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4oMI8ACm4J_BLSuF_I58pf9xd9a2AODApbJ26OI8N_GdELj4N_d_QUaO2jyUDxCyFyJXkTqet2vtH_FUorChcrm-prmaClohSMagyA4RDJxo0e7ZeKN5tcNhjBSUBeV8LS58LV2l03pWAfE0V-EQy2LXc9QEjHcHyTx9zVGXbYt644OLoX1CuS09BDRs2EkUIbAvjwlOUAU09lbwedXAkC_g_4mwZqMi5b_-76QuifqZ5aG6Ycy1IqFJ8YvPpOQZfdk_xrnLcDE4" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Personal Development", status: "loaned", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJcr7JXUIdvOLNV5zeQzYDM3MKJR0jJyE5EDmI2XW-pIX9LKg0rQRzYNxtw1VaRd8t1U0myehla4GojrSl-iGfIZnASNFZqUHGwRe0hHSfprOalErt5r0we25lZispa82alHdUPYoXv_-yCKfN3-SvjH9-ZttbC2jYcol7mrjp1r_kIVBop_nVQ2lFvyAn3jiyySehM3LkHhYct2EZLKypH--ym_lq-k6FbTg0paset0AP7mdTk1kS3BjdmueyjynLyBveZSFnqDs" },
    { title: "The 7 Habits", author: "Stephen Covey", category: "Personal Development", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoYV8PKNa-B6aj5axiwOfDhdXs0obVKfHyREmp15-b3EoaWciMTcB6hfaT3SMVSKFgvWFO1KYrqIwRRBO1K_uqawwNqTSSHRCSwKylb_YPK1TPpo-__hiH8_UNfZcagNwIDt13-Mmk4Axp9aSS6UXLcXxWUO2xLp_bTmpE3KxT6h9cYSc6wUx0_gvInfB6n00f_zx5tTIT97CjVZru1k5fGyaYa1T2svQDaCBf4NRCORwo266hqwMozGy6zZ_zOO122vn9hpRnkmw" },

    // Fiction
    { title: "Dune", author: "Frank Herbert", category: "Fiction", status: "reading", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRmeAQely2NMZiDB-1rurxnoaLbuNouj20wWin_poi6wiLOlenYsUUzDDJ2lbVRt6di8XxPbEqYlQgaNXujyqb6SupHAYrTR0wi85Kh2sQ46s4fMwEX8sjdVZxI_aXriVZ0fvsV1sCNGsU9zhfJPVqewrRcnOQ-n1KWA2L_xQNrve6DmTXDBirUcImVNnVHxCqTbrVs8PKqrpyOJ97750tCNGCjEDtmyjBujflpKwD2M864fhJP7Lb45MmR6bivKKS7hS1iuw3PVg" },
    { title: "Project Hail Mary", author: "Andy Weir", category: "Fiction", status: "reading", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRyQZflIXhlvlHHKw4lpTSPhfCsZhv6cFexTFS9VT5DNqq_JeTHs37a2AHb7Tbik5tgaaJmzskN8IkdqABcNElPaYPbzh5_pNFM7_59gjp6QMm9eXuSc-6SHwu_8q3OBTNX6r6vyl30DYtBbgHUusez2xcHN9evRbt2yoYSVz22UIeEkWws1gzIFZN-A9rbk5Vi0KV2JTyRM1ofQ5HMM-E4x0NH6ZnPbFOM2SdEslt04giB2i05ZBuCc1r9mzEa7U0CignkRZVAU0" },
    { title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fiction", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSMBsIh0xNye6HbPRyBVnRpOTdnUkx8ceYljucBfrv3weL74XQtzdYr1Ys2rzwC5WmKO0C-L3Zt_rnzbpVxmUSNTjjJv5SiThh9kdkJFjfqD_J0txYYGSzD1yLWFyc0-urnredi_cuYdWNKedO6y7uBc0YJ4WzIyRtQQ1xb25DSaXK_4xHaeKxrd04XSMuZ5F6ICu01L25uMzbtien8gdQnDN_oDlYzMlY_4Y7Blz3eQZsF4N5KNAuor49zr6R2aDcldponOtuY2A" },
    { title: "1984", author: "George Orwell", category: "Fiction", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwiA5N2jNnh15CIUmr0W7eEQrgMgvfhSpbDmehCAyI029Vp70N4GjT3O-_mCe7wjBNWkg7RUGKPzX5_p2kAJMfJzzc5hFt1pD75ImQ7HEWPVnawk95sLrSpR6NtFTLkhS24fzcDczIU4WVWtZhSip_6ieEbWlxrCtLKtx5COP94g-GY1VZjqFgcfh5YbSSj44voEWyMsn2Owr0KT7JiJhnzzO6BN2vETecC_Cyc_1zBlYb2xBhgiw239GAGLaKfxR9o-AIOjCgv14" },

    // Business
    { title: "Start with Why", author: "Simon Sinek", category: "Business", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpfo-9VCzJWiemYs7ymEKTlXsaxMszyGmWCQo6WO8oNDkbp42L-j9YGDNhJxbSDopHb2hBRrmokgQWb4IKZGUjbE8qnjD7LqBEOj6CRgSwk47pOfsolKE06Ppwns13hG2Ga6tm96QJYuWgjcIBtaMM5ToZ9BOgDc68c1hRK_3qXm2xAXonkoz2XEV_uaPXv1nEvbvNuCyp-zKRKi2qk4TjsHsXjupaqVcVuujeD7VGXP2tLdPFobAv8eKd0-Hz5jkvK9n3erl-TBk" },
    { title: "Zero to One", author: "Peter Thiel", category: "Business", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSnIw8py74MPnQaB6o_QeICh1wAm22jbrY7vYCSskTO2VrMHmqWRyF5Lw4182xHLHF0w5rlp5FXnPtK7zBlQRKbE2TZA_RuYUuJ8ZUm_F1-Ioq78QI0WdOd_JlyIWfB3NtfG6BkgCFMT18LjR7pdqXJbediUQL28a-yWzv_3PEuKjixJ1-WT20jlHtZM8GNSyU_zpvEOZ32Z_ozcPNwX9IDV28w3VYQu5K3G6umRfmQybRKVFUZPRc" },
    { title: "The Lean Startup", author: "Eric Ries", category: "Business", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZoHiHa8gJftBLggZXCsboc5HLepMoibMHRzlO8vJC5ACjokJ8qVszT7kfXsy34OXsAaizBV7ARYebKYMJ73YYfTRa46QLcrSfYvDk9Wsz2bh7W0Yk0SJMEe_XMwLLy7_nmjzTinDSpggXX3niPXYKcK7hHTwrj1O9nP3K3HYXAauc7bnvfJ7mLGttorvpCvxaSDg171nMiqICfl8Ni6E4LEjBSNFLQkSlU1wwUR5GZtoSC6SZ4_s9RqrspeMv8YTrwQaRK4b4QY8" },
    { title: "Blue Ocean Strategy", author: "W. Chan Kim", category: "Business", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQfJ2tNSTxlhAEWjw3XpWbeogeqx_-nI2VEzVX06QNNtDdqdwj9KubG-uX62g9cUi7-F4lEUbb8lYN2ecZSbXFo0UuN9CQ6JoYJB2bxXgMFoorLwBnKk-nBtPUd8ADqM93na1cxo5ZyaUpUaNbv-CfhBU17yDGUWVTBhO0bVO7LrPvEdqb6V_GFMeUMOw8hBOUIbDAB5swEimjP2_i-2PoJQnP0Wx7WEWN0M-DHeN26eZqU7Rj4VWdLHhsa4x_QtOjccmfn5woNyw" },
    { title: "Good to Great", author: "Jim Collins", category: "Business", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_kgtucVO9sOLi5qcsQrPZBBbw2PgM-XQLE7JzzQbES_YyWIvIahuXWdpHc0WbzypX2hI1uSLHwa3GVQSMTZIZFPmQ7_2sokc8ELX-trLQLOcBXdhDwh-SfDO5XH6DvfcpsVJeD7obGGnyYRvEcQBy5T3ZfZdGf7npWY8C4yREEqC-HONT-wU68jjZ-dmS8_5wC4AK7zf4Or-HdXFu_2589Pan6q1eHuLaJf6kXoClK-vb9fB2qIl8U1y59IGp9DwYwMWuX0QNEDc" },
    { title: "Shoe Dog", author: "Phil Knight", category: "Business", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsx4oVS1CPicuDPvwoB1zt2lhlRww2ZLgZhl7hlln-Zc-bxTq_4-QdeCc7a0YUTAHeX58eYW7VJmadGUgrMvWtHAaOfDvTFhbHGH7pJXlgTQGc345EMO8Dfi3G5XAmEjfDY8u0cJ3cEDb1YIF1WXc6iVLDk9gD28Ljr1Nsstl1LUkI6yJyowh537QbYJ0FHoc_HPwNoAhSH_heFTu3R_k48MW0z4eWvgWmNi_p40Bi4_dBZl2Yv1kFKCqlxlVC2dbM1ZKb21_WV7A" },
    { title: "Principles", author: "Ray Dalio", category: "Business", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHf1dvv_-LUM3Z1xNZzY8_xGJYo3RLkAWjJDp5ap8Lc1KqGFtjt05ytYRYN3c1oeK8Uyz2BrrmyJCf8rWMaYIsCLXVGgcGasF87abXXjklY1c9YZytexa46cNIjukrAGwYb7KeVCZsLXCZPGgx7zq9NTtcIV9XtPE8xvJ78D02Sr-V245JfnjiZia9Cw6kfbHbrRRkYsCzHTww3NXhO-wypWDCJgbLOZa7Sn1lmBuZ465KGdpVnzyVK4DsY215seGFZXM_GOSfL6U" },
    { title: "Measure What Matters", author: "John Doerr", category: "Business", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtULjGMn4Z7bfe2ZeUDPXpvTJUkcOCReV95o1UtDl3THBRe-MzAswfkMBVnRm96d8SzBTF20hXGLPdymC6cCrC-xHhBj7CNjSY_nHaExhZKl02dZkI72WugfPRVqgq0Krw0IW-xtIJYEI1jK68JbIXOzD6i6CaoClEg_usNpVNd7YpiYaXBm4UtiqhUhCYnhusCFYcseuAOe0tN8nOoKo967uElKXIscColIEjSoljFzrN5rYu6QWqLiftETtRWcRjEhMNeiSFv3Q" },

    // Design & Tech
    { title: "The Design of Everyday Things", author: "Don Norman", category: "Design", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaTFO3h9xYvkO4SJRBtAKo2Hkzw9U2t3wB6nOOSkPixYTLWoa1HdQPim0zdd5AeAi6mbAokViieu2Poyavhvy-_dckv9iGfLY7lBdNF84L-T6Ayh-ryEIBjHvrjY-fEDuqsJmcA1MIovrhivGvar7iri-nBhAicG3H88Kz-tdVOFPeowPdYFOB5GEki3QreyE90hMnth0vLg20dwzJeGDDcFF5Bcevb9QDhnbb5OtwuMssTBckykqEIFuOU2Pp8zam4LKdvwYbwlA" },
    { title: "Data Structures and Algorithms", "author": "Robert Lafore", category: "Tech", status: "available", coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuATQ9_UdUrrIIrB-J2ydf4xsWNZkqa011NhhWYrK7Uazg1M4CMg_zZQBzMvknTwR_8Qp9V3gaHfZTbl-KBBHHyZxLF4Lj2aXgJ7_jighD4xWj6P0883-Isw269UBLeLQBEjs7bkhnUjEeNsNohHTyXtRNmeoy1SiumopeJdeyAyWykz-jFJytZ5lGKftsLr_5-yaq02oIXpvH1JFMiO19mq2iPZx-raiuS1JBPvyJDxl94fPgphmPwSc3dV2XbvPfbxt2zXLW79xzA" },
];

const USER_DATA = {
    name: "Hugo Capitelli",
    email: "hugo@biblioteca.com",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvKidoVdmsaeoZzPs4av8kedidprrtSRCIaOAIhBy6PtHE2GnX2ylO4hLOFNQJsEYPrv-grP488bF7W1jcROWUJb6WkQXxNQP_1xWv3B-4XEtOyyl7xiYKT0rMtYdoBAccRy5SSu4glWER5tn2vVb7m87CpwHLeFha5M-icyirn9Te2Fd2N_TLQToEhY3VHRJPMgoPFAUePpVqSL4b31Z8Cv3pvUCWBX_ZKZMJijrd_71sqP-37DD6oG-tAGobdlfwvmEBijRhCzc",
    member_since: "2021"
};

async function seedDatabase() {
    console.log('🌱 Starting database seed...\n');

    try {
        // 1. Create user
        console.log('👤 Creating user...');
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert([USER_DATA])
            .select()
            .single();

        if (userError) {
            if (userError.code === '23505') {
                console.log('   User already exists, fetching existing user...');
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', USER_DATA.email)
                    .single();
                console.log(`   ✓ User: ${existingUser.name}`);
            } else {
                throw userError;
            }
        } else {
            console.log(`   ✓ Created user: ${user.name}`);
        }

        // 2. Seed books
        console.log('\n📚 Seeding books...');
        const booksToInsert = BOOKS_DATA.map(book => ({
            title: book.title,
            author: book.author,
            category: book.category,
            status: book.status,
            cover_url: book.coverUrl,
            added_date: new Date().toISOString(),
        }));

        const { data: books, error: booksError } = await supabase
            .from('books')
            .insert(booksToInsert)
            .select();

        if (booksError) throw booksError;
        console.log(`   ✓ Created ${books.length} books`);

        // 3. Create some reading progress for books with "reading" status
        console.log('\n📖 Creating reading progress...');
        const readingBooks = books.filter(b => b.status === 'reading');

        if (user && readingBooks.length > 0) {
            const progressData = readingBooks.map((book, index) => ({
                book_id: book.id,
                user_id: user.id,
                progress_percentage: [65, 32, 88][index] || 50, // Varied progress
            }));

            const { error: progressError } = await supabase
                .from('reading_progress')
                .insert(progressData);

            if (progressError) throw progressError;
            console.log(`   ✓ Created reading progress for ${progressData.length} books`);
        }

        // 4. Create some loan history
        console.log('\n📝 Creating loan history...');
        const loanedBooks = books.filter(b => b.status === 'loaned');

        if (loanedBooks.length > 0) {
            const loanData = loanedBooks.map((book, index) => ({
                book_id: book.id,
                person_name: ['João Silva', 'Maria Santos', 'Pedro Costa'][index] || 'Friend',
                person_initials: ['JS', 'MS', 'PC'][index] || 'FR',
                status: 'active',
                loan_date: new Date(Date.now() - (index + 1) * 86400000 * 10).toISOString(), // 10, 20, 30 days ago
            }));

            const { error: loanError } = await supabase
                .from('loans')
                .insert(loanData);

            if (loanError) throw loanError;
            console.log(`   ✓ Created ${loanData.length} active loans`);
        }

        console.log('\n✅ Database seeded successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Users: 1`);
        console.log(`   - Books: ${books.length}`);
        console.log(`   - Reading progress: ${readingBooks.length}`);
        console.log(`   - Active loans: ${loanedBooks.length}`);
        console.log('\n🎉 You can now run the app with: npm run dev');

    } catch (error) {
        console.error('\n❌ Error seeding database:', error.message);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
