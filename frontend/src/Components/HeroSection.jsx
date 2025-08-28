import React from "react";
import { MessageSquare } from "lucide-react";
import "../StyleSheets/HeroSection.css";

const HeroSection = () => {
    return (
        <section className="heroSection">
            <div className="HeroTextDiv">
                <div className="captionDiv">
                    <h1 className="H1">Raise Your</h1>
                    <h1 className="H1">
                        Voice. <span className="highlight">Get Your</span>
                    </h1>
                    <h1 className="h1 H1">Problem</h1>
                    <h1 className="h1 H1">Resolved</h1>
                </div>

                <p className="description">
                    Report issues in your area with photo & location. <br></br> Stay anonymous. Track
                    progress.
                </p>
            </div>

            <div className="heroButtonContainer">
                <button className="heroButton">
                    <MessageSquare className="icon" />
                    Raise Complaint
                </button>
            </div>
        </section>
    );
};

export default HeroSection;
