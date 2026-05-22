import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog — Guias de UTM e Tráfego Pago",
  description: "Artigos práticos sobre links UTM, rastreamento de campanhas e gestão de tráfego pago para gestores e agências brasileiras.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text mb-3">Blog</h1>
        <p className="text-muted">Guias práticos sobre UTM, rastreamento e gestão de tráfego pago.</p>
      </div>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <article className="bg-white rounded-2xl border border-border p-6 hover:border-brand/30 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3 text-xs text-muted">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </time>
                <span>·</span>
                <span>{post.readingTime} de leitura</span>
              </div>
              <h2 className="text-lg font-bold text-text mb-2 group-hover:text-brand transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-muted text-sm leading-relaxed">{post.description}</p>
              <div className="mt-4 text-sm font-medium text-brand group-hover:underline">
                Ler artigo →
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
