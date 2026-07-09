import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';

export default function DashboardRev() {
  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 className="ds-h1">Welcome back, Creator</h1>
          <div className="ds-muted">Overview of your activity and quick actions</div>
        </div>
        <div className="row">
          <Button variant="ghost">Share</Button>
          <Button variant="primary">Create</Button>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: 24 }}>
        <Card>
          <div className="kpi">
            <div>
              <div className="value">1,248</div>
              <div className="label ds-muted">Active learners</div>
            </div>
            <div className="ds-muted">+8% this week</div>
          </div>
        </Card>

        <Card>
          <div className="kpi">
            <div>
              <div className="value">24</div>
              <div className="label ds-muted">Courses published</div>
            </div>
            <div className="ds-muted">2 new</div>
          </div>
        </Card>

        <Card>
          <div className="kpi">
            <div>
              <div className="value">98%</div>
              <div className="label ds-muted">Completion rate</div>
            </div>
            <div className="ds-muted">Stable</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2" style={{ gap: 24 }}>
        <Card>
          <h2 className="ds-h2">Recent Activity</h2>
          <ul style={{ marginTop: 8 }}>
            <li className="ds-muted">User Jane completed Intro to React — 2h ago</li>
            <li className="ds-muted">New comment on State management — 5h ago</li>
            <li className="ds-muted">Payment processed for Course #24 — 1d ago</li>
          </ul>
        </Card>

        <Card>
          <h2 className="ds-h2">Engagement</h2>
          <ul style={{ marginTop: 8 }}>
            <li className="ds-muted">Weekly active learners: 184</li>
            <li className="ds-muted">Average lesson completion: 81%</li>
            <li className="ds-muted">Most active cohort: Product design</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
