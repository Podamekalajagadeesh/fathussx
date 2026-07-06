import PropTypes from 'prop-types';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`ds-card ${className}`} {...props}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
