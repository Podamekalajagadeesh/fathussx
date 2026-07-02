import PropTypes from 'prop-types';

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  const cls = `ds-btn ds-btn-${variant} ${className}`.trim();
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
