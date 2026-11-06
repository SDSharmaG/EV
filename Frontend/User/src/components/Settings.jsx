import React from 'react';

const Settings = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-gear-fill me-2"></i>
                Settings
              </h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>General Settings</h5>
                  <div className="mb-3">
                    <label className="form-label">Site Name</label>
                    <input type="text" className="form-control" placeholder="EV Charging Manager" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Timezone</label>
                    <select className="form-select">
                      <option>UTC</option>
                      <option>IST</option>
                      <option>EST</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <h5>Notification Settings</h5>
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                    <label className="form-check-label" htmlFor="emailNotifications">
                      Email Notifications
                    </label>
                  </div>
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" id="smsNotifications" />
                    <label className="form-check-label" htmlFor="smsNotifications">
                      SMS Notifications
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button className="btn btn-primary">Save Settings</button>
                <button className="btn btn-outline-secondary ms-2">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;