
import React from 'react';

const Lesson2 = () => {
  return (
    <div className="lesson-content max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Comparison: Traditional vs. AI Workflow Timelines</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Why timelines matter</h2>
        <p>
          Understanding production timelines helps you plan realistically and choose tools that fit your budget,
          team size, and release goals. AI can compress early drafts and experimentation, while traditional methods
          may take longer but offer precise manual control.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Typical stages to compare</h2>
        <ul className="list-disc pl-6">
          <li>Idea generation and concept art</li>
          <li>Script and storyboard</li>
          <li>Asset creation (characters, backgrounds, props)</li>
          <li>Animation / motion tests</li>
          <li>Sound design and music</li>
          <li>Editing and polish</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key takeaway</h2>
        <p>
          AI-assisted workflows shine when you need speed and iteration—especially for drafts, references, and
          rapid prototyping. Traditional workflows remain essential for final artistic control, quality assurance,
          and consistent style across scenes.
        </p>
      </section>
    </div>
  );
};

export default Lesson2;

