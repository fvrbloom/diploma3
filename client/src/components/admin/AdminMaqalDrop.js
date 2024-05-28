import React, { useState } from "react";
import axios from "axios";

function AdminMaqalDrop({ username }) {
  const [sentence, setSentence] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/news/add", {
        username,
        sentence,
      });
      console.log(response.data);
      alert("Added successfully");
      setSentence("");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      alert("Error adding maqal/matel");
    }
  };

  return (
    <div className="adminMaqal content__body">
      <div className="container">
        <div className="maqal__inner">
          <h1 className="maqal__title title">MAQAL DROP</h1>
          <div className="maqal-section">
          <p className="admin-instructions">
                Good day, please type the existing "мақал/мәтел" in Kazakh language.
                After clicking the "Add News" button, it will be saved accordingly.
              </p>
            <form className="news-form" onSubmit={handleSubmit}>
              <textarea
                className="textarea_maqal"
                placeholder='Type "maqal-matel" here'
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
              ></textarea>
              <div className="button-container">
                <button className="button button_login" type="submit">Add News</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default AdminMaqalDrop;
