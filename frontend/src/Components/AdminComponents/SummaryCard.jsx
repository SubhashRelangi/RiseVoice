import React from 'react';
import styles from './SummaryCard.module.css';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const SummaryCard = ({ title, count, percentage, icon, color, percentageColor }) => {
  const percentageStyle = {
    color: percentageColor,
  };

  const trendIcon = percentage > 0 ? <FiTrendingUp /> : <FiTrendingDown />;

  return (
    <div className={styles.card} style={{ borderLeft: `5px solid ${color}` }}>
      <div className={styles.cardContent}>
        <p className={styles.title}>{title}</p>
        <div className={styles.stats}>
          <h2 className={styles.count}>{count}</h2>
          <p className={styles.percentage} style={percentageStyle}>
            {trendIcon} {Math.abs(percentage)}%
          </p>
        </div>
      </div>
      <div className={styles.iconWrapper} style={{ backgroundColor: color }}>
        {icon}
      </div>
    </div>
  );
};

export default SummaryCard;
