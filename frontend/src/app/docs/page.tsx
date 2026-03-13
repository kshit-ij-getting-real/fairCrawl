import { PageShell } from '@/components/shared/PageShell';
import { Card } from '@/components/shared/Card';
import { CodeBlock } from '@/components/shared/CodeBlock';

const sections = [
  ['welcome', 'Welcome'],
  ['publishers', 'Publishers'],
  ['ai-clients', 'AI Clients'],
  ['api-reference', 'API Reference'],
  ['webhooks', 'Webhooks'],
  ['faq', 'FAQ'],
  ['changelog', 'Changelog'],
] as const;

export default function DocsPage() {
  return (
    <PageShell>
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="sticky top-6 h-fit rounded-2xl border border-[rgba(126,135,212,0.18)] bg-[rgba(255,255,255,0.72)] p-4 text-sm shadow-[0_16px_34px_rgba(126,120,210,0.1)] backdrop-blur-xl">
          <p className="mb-3 font-semibold text-[#25306d]">Docs</p>
          <ul className="space-y-2 text-[#6f769b]">
            {sections.map(([id, label]) => (
              <li key={id}><a href={`#${id}`}>{label}</a></li>
            ))}
          </ul>
        </aside>
        <div className="space-y-6">
          <Card>
            <h1 id="welcome" className="text-2xl font-semibold">Welcome</h1>
            <p className="mt-2 text-[#6f769b]">Example first: an AI client buys access to one paywalled article. It checks rates, mints a token, fetches content, then both sides see the transaction.</p>
            <CodeBlock code={`GET /api/rates?url=https://news.example.com/premium/story\nPOST /api/tokens\nGET /api/content?url=https://news.example.com/premium/story`} />
          </Card>
          <Card>
            <h2 id="publishers" className="text-xl font-semibold">Publishers</h2>
            <p className="text-[#6f769b]">Create a property, verify DNS, then add rates by exact URL, path prefix, or regex with license codes.</p>
          </Card>
          <Card>
            <h2 id="ai-clients" className="text-xl font-semibold">AI Clients</h2>
            <p className="text-[#6f769b]">Tokens are scoped to URL + license + agent identity and include expiry and optional max price.</p>
          </Card>
          <Card>
            <h2 id="api-reference" className="text-xl font-semibold">API Reference</h2>
            <CodeBlock code={`POST /api/publisher/properties\nPOST /api/publisher/properties/:id/verify-dns\nPOST /api/publisher/rates\nGET /api/rates?url=...\nPOST /api/tokens\nGET /api/content?url=...`} />
            <p className="mt-3 text-[#6f769b]">Errors use <code>{`{ error: { code, message, details? } }`}</code>.</p>
          </Card>
          <Card>
            <h2 id="webhooks" className="text-xl font-semibold">Webhooks</h2>
            <p className="text-[#6f769b]">Register webhook endpoints for transaction events using publisher webhook CRUD APIs.</p>
          </Card>
          <Card>
            <h2 id="faq" className="text-xl font-semibold">FAQ</h2>
            <p className="text-[#6f769b]">FairFetch is an opt-in paid content marketplace.</p>
          </Card>
          <Card>
            <h2 id="changelog" className="text-xl font-semibold">Changelog</h2>
            <ul className="list-disc pl-5 text-[#6f769b]"><li>Added marketplace paid lane docs and endpoint guide.</li></ul>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
