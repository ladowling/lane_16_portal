export default function TermsPage() {
  return (
    <main className="flex-1 px-6 py-16 md:px-20">
      <div className="mx-auto max-w-4xl text-white">
        <h1 className="mb-8 text-4xl font-bold md:text-5xl">Terms of Use</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300">
          <p className="mb-4">
            [Placeholder: The final Terms of Use text will be inserted here.]
          </p>
          <p className="mb-4">
            <strong>Contact Information:</strong><br />
            Lane16<br />
            Email: <a href="mailto:support@lane16.com" className="text-[#3ba321] hover:underline">support@lane16.com</a><br />
            Website: <a href="http://www.lane16.com" className="text-[#3ba321] hover:underline">www.lane16.com</a>
          </p>
        </div>
      </div>
    </main>
  );
}