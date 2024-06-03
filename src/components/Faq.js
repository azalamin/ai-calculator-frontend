import React from 'react';
import './Faq.css';

const Faq = () => {
  return (
    <div className="content">
        <h1 className='faq'>FAQ</h1>
      <div>
        <input type="checkbox" id="question1" name="q" className="questions" />
        <div className="plus">+</div>
        <label htmlFor="question1" className="question">
          This is the question that will be asked?
        </label>
        <div className="answers">
        React is a popular JavaScript library used for building user interfaces, particularly for single-page applications. It allows developers to create reusable UI components and efficiently manage state using concepts like virtual DOM and component lifecycle methods. React's declarative approach makes it easier to build complex UIs and ensure better performance by minimizing DOM manipulations.
        </div>
      </div>

      <div>
        <input type="checkbox" id="question2" name="q" className="questions" />
        <div className="plus">+</div>
        <label htmlFor="question2" className="question">
          Short?
        </label>
        <div className="answers">Python is a versatile programming language known for its readability and simplicity. It supports multiple programming paradigms, including procedural, object-oriented, and functional programming. Python's extensive standard library and third-party packages make it suitable for a wide range of applications, from web development and data analysis to artificial intelligence and automation.</div>
      </div>

      <div>
        <input type="checkbox" id="question3" name="q" className="questions" />
        <div className="plus">+</div>
        <label htmlFor="question3" className="question">
          Keep answers short. But in case of...If the question is long, the text wraps.
        </label>
        <div className="answers">Git is a distributed version control system widely used for tracking changes in source code during software development. It allows multiple developers to collaborate on projects efficiently by managing different versions of files and enabling features.</div>
      </div>
    </div>
  );
};

export default Faq;
