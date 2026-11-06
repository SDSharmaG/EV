import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Station.css';

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  // const [selectedStation, setSelectedStation] = useState(null);
  // const [showChargersPopup, setShowChargersPopup] = useState(false);
  // const [stationChargers, setStationChargers] = useState([]);
  const navigate = useNavigate();

  // Fetch all stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/stationinfo');
        
        if (!res.ok) {
          throw new Error('Failed to fetch stations');
        }
        
        const data = await res.json();
        console.log('API Response:', data);
        
        let stationsData = [];
        
        if (Array.isArray(data)) {
          stationsData = data;
        } else if (data.stations && Array.isArray(data.stations)) {
          stationsData = data.stations;
        } else if (data.data && Array.isArray(data.data)) {
          stationsData = data.data;
        }
        
        setStations(stationsData);
      } catch (err) {
        console.error('Error fetching stations:', err);
        setError('Failed to load stations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStations();   // refresh stations once

 }, []);

  // // Fetch chargers for a specific station

  // const fetchStationChargers = async (stationId) => {
  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/getchargerbyid/${stationId}`);
  //     if (res.ok) {
  //       const data = await res.json();
  //       setStationChargers(data.chargers || data.data || []);
  //     } else {
  //       // setStationChargers([]);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching chargers:', error);
  //     // setStationChargers([]);
  //   }
  // };

  // Show chargers popup
  const handleShowChargers = async (station) => {
     navigate('/layout/chargers', {
    state: { station }
  });
  };

  // Filter stations based on status
  const filteredStations = Array.isArray(stations) ? stations.filter(station => {
    if (filter === 'all') return true;
    return station.status?.toLowerCase() === filter.toLowerCase();
  }) : [];

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-success';
      case 'close':
        return 'bg-secondary';
      case 'maintenance':
        return 'bg-warning';
      default:
        return 'bg-info';
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'Open';
      case 'close':
        return 'Closed';
      case 'maintenance':
        return 'Maintenance';
      default:
        return status || 'Unknown';
    }
  };

  // Safe array length check
  const getStationsCount = () => {
    return Array.isArray(stations) ? stations.length : 0;
  };

  // Safe filter count
  const getStatusCount = (status) => {
    return Array.isArray(stations) 
      ? stations.filter(s => s.status?.toLowerCase() === status.toLowerCase()).length
      : 0;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading stations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">
          <i className="bi bi-ev-station me-2"></i>
          Charging Stations
        </h2>
        
        {/* Status Filter */}
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">Filter by status:</span>
          <select 
            className="form-select form-select-sm w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Stations</option>
            <option value="open">Open</option>
            <option value="close">Closed</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{getStationsCount()}</h4>
                  <small>Total Stations</small>
                </div>
                <i className="bi bi-ev-station display-6 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{getStatusCount('open')}</h4>
                  <small>Active</small>
                </div>
                <i className="bi bi-check-circle display-6 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{getStatusCount('close')}</h4>
                  <small>Offline</small>
                </div>
                <i className="bi bi-x-circle display-6 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{getStatusCount('maintenance')}</h4>
                  <small>Maintenance</small>
                </div>
                <i className="bi bi-tools display-6 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      {!Array.isArray(filteredStations) || filteredStations.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-ev-station display-1 text-muted"></i>
          <h4 className="text-muted mt-3">No stations found</h4>
          <p className="text-muted">
            {filter === 'all' 
              ? 'No stations available at the moment.' 
              : `No stations with ${filter} status.`
            }
          </p>
        </div>
      ) : (
        <div className="row" >
          {filteredStations.map((station) => (
            <div key={station._id || station.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card station-card h-100 shadow-sm" onClick={() => handleShowChargers(station)}>
                {/* Station Image */}
                {station.imageUrl && (
                  <img 
                    src={station.imageUrl}
                    alt={station.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                {!station.imageUrl && (
                  <div 
                    className="card-img-top bg-light d-flex align-items-center justify-content-center"
                    style={{ height: '200px' }}
                  >
                    <i className="bi bi-ev-station display-4 text-muted"></i>
                  </div>
                )}
                
                <div className="card-body d-flex flex-column">
                  {/* Station Header */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{station.name || 'Unnamed Station'}</h5>
                    <span className={`badge ${getStatusClass(station.status)}`}>
                      {getStatusText(station.status)}
                    </span>
                  </div>

                  {/* Station Details */}
                  <div className="station-details flex-grow-1">
                    <div className="mb-2">
                      <i className="bi bi-geo-alt text-muted me-2"></i>
                      <small className="text-muted">{station.location || 'Location not specified'}</small>
                    </div>
                    
                    <div className="mb-2">
                      <i className="bi bi-lightning-charge text-muted me-2"></i>
                      <small className="text-muted">
                        {station.chargers || 0} charger{station.chargers !== 1 ? 's' : ''} available
                      </small>
                    </div>
                  </div>

                

                  {/* Action Button */}
                  <div className="mt-auto">
                    <button 
                      className={`btn w-100 ${
                        station.status?.toLowerCase() === 'open' 
                          ? 'btn-primary' 
                          : 'btn-outline-secondary'
                      }`}
                      disabled={station.status?.toLowerCase() !== 'open'}
                      onClick={(e) =>{ 
                        e.stopPropagation();
                        handleShowChargers(station)}}
                    >
                      {station.status?.toLowerCase() === 'open' 
                        ? 'View Chargers & Book' 
                        : 'Currently Unavailable'
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chargers Popup Modal
      {showChargersPopup && selectedStation && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-lightning-charge me-2"></i>
                  Available Chargers - {selectedStation.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowChargersPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {stationChargers.length === 0 ? (
                    <div className="col-12 text-center py-4">
                      <i className="bi bi-lightning-charge display-4 text-muted"></i>
                      <p className="text-muted mt-3">No chargers available at this station</p>
                    </div>
                  ) : (
                    stationChargers.map((charger) => (
                      <div key={charger._id} className="col-md-6 mb-3" onClick={() => handleBookCharger(charger)}>
                        <div className="card charger-card h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="card-title mb-0">
                                <i className="bi bi-plug me-2"></i>
                                {charger.name || `Charger ${charger.chargername}`}
                              </h6>
                              <span className={`badge ${
                                charger.status?.toLowerCase() === 'available' ? 'bg-success' : 'bg-secondary'
                              }`}>
                                {charger.status || 'Unknown'}
                              </span>
                            </div>
                            
                            <div className="charger-details">
                              <small className="text-muted d-block">
                                <i className="bi bi-lightning me-1"></i>
                                {charger.poweroutput || 'N/A'} kW
                              </small>
                              <small className="text-muted d-block">
                                <i className="bi bi-plug-fill me-1"></i>
                                {charger.connectortype || 'Type 2'}
                              </small>
                              {charger.rate && (
                                <small className="text-muted d-block">
                                  <i className="bi bi-currency-dollar me-1"></i>
                                  {charger.rate}
                                </small>
                              )}
                            </div>
                            
                            <button
                              className={`btn btn-sm w-100 mt-2 ${
                                charger.status?.toLowerCase() === 'available' ? 'btn-success' : 'btn-secondary'
                              }`}
                              disabled={charger.status?.toLowerCase() !== 'available'}
                              onClick={() => handleBookCharger(charger)}
                            >
                              {charger.status?.toLowerCase() === 'available' ? 'Book This Charger' : 'Not Available'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowChargersPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Stations;