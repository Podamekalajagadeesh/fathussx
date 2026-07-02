import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CourseTable = ({ courses }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.title}</td>
            <td>{course.is_published ? 'Published' : 'Draft'}</td>
            <td>
              <Link to={`/creator/course/${course.id}/edit`}>Edit</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

CourseTable.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      is_published: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default CourseTable;