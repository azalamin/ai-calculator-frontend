import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-container">
      <form className="contact-form" action="" method="post">
        <h3>Quick Contact</h3>
        <h4>Contact us today, and get a reply within 24 hours!</h4>
        <fieldset>
          <input className="contact-input" placeholder="Your name" type="text" tabIndex="1" required autoFocus />
        </fieldset>
        <fieldset>
          <input className="contact-input" placeholder="Your Email Address" type="email" tabIndex="2" required />
        </fieldset>
        <fieldset>
          <input className="contact-input" placeholder="Your Phone Number" type="tel" tabIndex="3" required />
        </fieldset>
        <fieldset>
          <input className="contact-input" placeholder="Your Web Site starts with http://" type="url" tabIndex="4" required />
        </fieldset>
        <fieldset>
          <textarea className="contact-textarea" placeholder="Type your Message Here...." tabIndex="5" required></textarea>
        </fieldset>
        <fieldset>
          <button className="contact-button" name="submit" type="submit" data-submit="...Sending">Submit</button>
        </fieldset>
      </form>
    </div>
  );
}

export default Contact;
