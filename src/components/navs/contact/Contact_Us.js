import emailjs from "emailjs-com";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { isAuthenticated } from "../../../functions/auth";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import "./Contact_Us.css";

function Contact_Us() {
  const { user } = isAuthenticated();
  const [send, setSend] = useState("Send");

  const sendMail = (e) => {
    e.preventDefault();
    setSend("Sending...");
    emailjs
        .sendForm(
          "service_i18h2lq",
          "template_6dxivza",
          e.target,
          "user_UdgQW2uxRt0vdGCQzkK9Y"
        )
        .then((res) => {
          console.log(res);
          toast.success(
            "Message sent....we will get back to you as soon as possible."
          );
          setTimeout(() => {
            setSend("Send");
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Message Failed. Please try again.");
          setTimeout(() => {
            setSend("Send");
            window.location.reload();
          }, 1000);
        });
  };
  return (
    <div className="mailer">
      <Header />
      <div class="contact">
        <div className="banner">
          <h1 className="banner-title mt-4">CONTACT US</h1>
        </div>
        <div class="inner-section">
          <div className="form__box">
            <form className="row form" onSubmit={sendMail}>
              <center>
                <h1>Contact Form</h1>
              </center>
              <hr />
              <div>
                <label>NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  required
                />
              </div>

              <div className="mt-4">
                <label>EMAIL</label>
                <input
                  type="email"
                  name="user_email"
                  required
                  className="form-control"
                />
              </div>

              <div className="mt-4">
                <label>MESSAGE</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="10"
                  required
                ></textarea>
              </div>

              <div>
                <input
                  className="mt-4 contact__btn"
                  type="submit"
                  value={send}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact_Us;
