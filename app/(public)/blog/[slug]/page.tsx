import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostBySlug, getAllPosts } from "@/content/posts";
import { AdSenseBlock } from "@/components/marketing/AdSenseBlock";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

function renderContent(markdown: string) {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let tableRows: string[][] = [];
  let inTable = false;
  let key = 0;

  function flushList() {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={key++} className="list-disc pl-6 text-muted leading-relaxed flex flex-col gap-2 my-4">
        {listItems.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
        ))}
      </ul>
    );
    listItems = [];
  }

  function flushTable() {
    if (tableRows.length === 0) return;
    const [header, , ...body] = tableRows;
    elements.push(
      <div key={key++} className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-brand text-white">
              {header.map((cell, i) => (
                <th key={i} className="px-4 py-2 text-left">{cell.trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, i) => (
              <tr key={i} className="border-b border-border hover:bg-gray-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-muted" dangerouslySetInnerHTML={{ __html: inlineFormat(cell.trim()) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  }

  function inlineFormat(text: string) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
  }

  let inCodeBlock = false;
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        flushList();
        flushTable();
        inCodeBlock = true;
        codeLines = [];
      } else {
        elements.push(
          <pre key={key++} className="bg-gray-50 border border-border rounded-xl p-4 font-mono text-xs overflow-x-auto my-4 leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        inCodeBlock = false;
        codeLines = [];
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(line); continue; }

    if (line.startsWith("|")) {
      inTable = true;
      tableRows.push(line.split("|").filter((_, i) => i > 0 && i < line.split("|").length - 1));
      continue;
    }
    if (inTable && !line.startsWith("|")) { flushTable(); }

    if (line.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={key++} className="text-2xl font-bold text-text mt-10 mb-4">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={key++} className="text-lg font-bold text-text mt-6 mb-3">{line.slice(4)}</h3>);
    } else if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else if (line.trim()) {
      flushList();
      elements.push(
        <p key={key++} className="text-muted leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
      );
    }
  }
  flushList();
  flushTable();
  return elements;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const allPosts = getAllPosts();
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": { "@type": "Organization", "name": "UTM Rápido" },
    "publisher": { "@type": "Organization", "name": "UTM Rápido", "url": "https://utmrapido.com.br" },
  };

  const paragraphs = post.content.split("\n\n");
  const midpoint = Math.floor(paragraphs.length / 2);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-brand">Home</Link>
          {" › "}
          <Link href="/blog" className="hover:text-brand">Blog</Link>
          {" › "}
          <span>{post.title}</span>
        </nav>

        <article>
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </time>
              <span>·</span>
              <span>{post.readingTime} de leitura</span>
            </div>
          </header>

          <AdSenseBlock slot="article-top" />

          <div className="prose-custom">
            {renderContent(
              paragraphs.slice(0, midpoint).join("\n\n")
            )}
          </div>

          <AdSenseBlock slot="article-mid" />

          <div className="prose-custom">
            {renderContent(
              paragraphs.slice(midpoint).join("\n\n")
            )}
          </div>

          <AdSenseBlock slot="article-bottom" />

          {/* CTA */}
          <div className="bg-brand rounded-2xl p-8 text-center text-white mt-10">
            <h2 className="text-2xl font-bold mb-2">Crie seus links UTM agora</h2>
            <p className="text-white/80 mb-6 text-sm">Gerador gratuito com validação automática e histórico por cliente.</p>
            <Link href="/#gerador" className="inline-block bg-white text-brand font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Usar o gerador grátis →
            </Link>
          </div>
        </article>

        {/* Posts relacionados */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-text mb-6">Leia também</h2>
            <div className="flex flex-col gap-4">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                  <div className="bg-white rounded-xl border border-border p-5 hover:border-brand/30 transition-all">
                    <p className="font-semibold text-text group-hover:text-brand transition-colors">{p.title}</p>
                    <p className="text-sm text-muted mt-1">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
