import Link from "next/link";

export function FAQSection() {
  const cards = [
    {
      icon: "fa-solid fa-file-pdf",
      title: "How will this site be beneficial?",
      content: (
        <>
          <p>
            No more wasting time searching for PDFs or videos. We bring all your
            essential study materials together in one place to keep you focused
            and curious.
          </p>
          <p>
            Explore the{" "}
            <Link
              href="/shelf"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Book Shelf
            </Link>{" "}
            for additional resources.
          </p>
        </>
      ),
    },
    {
      icon: "fa-solid fa-file-code",
      title: "How will the Code Library help you?",
      content: (
        <>
          <p>
            It will spark your curiosity to learn something new and inspire the
            creativity to build something unique that stands out from the crowd.
          </p>
          <p>
            Explore the{" "}
            <Link
              href="/codelibrary"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Code Library
            </Link>{" "}
            – where learners debug and grow together.
          </p>
        </>
      ),
    },
    {
      icon: "fa-solid fa-graduation-cap",
      title: "What's in the Alumni Section?",
      content: (
        <>
          <p>
            The Alumni Section connects you with RUET CSE graduates, sharing
            their experiences, career journeys, and advice for current students.
          </p>

          <p>
            Discover inspiring stories from{" "}
            <Link
              href="/alumni"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Alumni
            </Link>{" "}
            and build your network for future opportunities.
          </p>
        </>
      ),
    },
    {
      icon: "fa-solid fa-users",
      title: "Who are we?",
      content: (
        <p>
          We are a group of{" "}
          <Link
            href="/contact&help/developers"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            RUET CSE students
          </Link>{" "}
          who are passionate about programming and love to help others. We aim
          to create a platform that makes learning easier and more accessible
          for everyone.
        </p>
      ),
    },
  ];

  return (
    <section
      aria-labelledby="faq-heading"
      className="w-full px-6 sm:px-8 py-16 sm:py-20"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Good to know
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight"
          >
            Frequently asked questions
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Let&rsquo;s answer some FAQs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className="reveal group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#071a26] p-7 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/5 transition-all duration-300"
              style={{ "--reveal-delay": `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <i className={`${card.icon} text-xl`} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {card.title}
                </h3>
              </div>
              <div className="mt-3 text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">
                {card.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
