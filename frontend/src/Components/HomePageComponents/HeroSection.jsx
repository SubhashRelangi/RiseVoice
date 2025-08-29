import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import styles from "./HeroSection.module.css"; // CSS Module import

const HeroSection = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroTextDiv}>
                <div className={styles.captionDiv}>
                    <h1 className={styles.H1}>Raise Your</h1>
                    <h1 className={styles.H1}>
                        Voice. <span className={styles.highlight}>Get Your</span>
                    </h1>
                    <h1 className={`${styles.H1} ${styles.h1}`}>Problem</h1>
                    <h1 className={styles.H1}>Resolved</h1>
                </div>

                <p className={styles.description}>
                    Report issues in your area with photo & location. <br /> Stay anonymous. Track
                    progress.
                </p>
            </div>

            <div className={styles.heroButtonContainer}>
                <Link to="/raise-complaint" className={styles.heroButton}>
                    <MessageSquare className={styles.icon} />
                    Raise Complaint
                </Link>
            </div>
        </section>
    );
};

export default HeroSection;
