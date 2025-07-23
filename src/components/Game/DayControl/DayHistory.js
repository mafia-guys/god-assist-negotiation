import React from 'react';

const DayHistory = ({ dayNumber, events, isCurrentDay }) => {
  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'phase_change': return '🔄';
      case 'speaking': return '🗣️';
      case 'challenge': return '⚔️';
      case 'vote': return '🗳️';
      case 'trial_vote': return '⚖️';
      case 'trial_result': return '⚖️';
      case 'elimination': return '💀';
      case 'revival': return '💚';
      case 'day_start': return '🌅';
      case 'day_complete': return '🌙';
      default: return '📝';
    }
  };

  const getEventText = (event) => {
    switch (event.type) {
      case 'phase_change':
        return `مرحله تغییر کرد به: ${event.phase}`;
      case 'speaking':
        return `${event.playerName} صحبت کرد`;
      case 'challenge':
        return `${event.challengerName} به ${event.challengeeName} چالش داد`;
      case 'vote':
        return `${event.playerName} ${event.voteCount} رای دریافت کرد`;
      case 'trial_vote':
        return `${event.playerName} در محاکمه ${event.voteCount} رای دریافت کرد`;
      case 'trial_result':
        return event.description;
      case 'elimination':
        return event.description; // Use the description which now includes day information
      case 'revival':
        return `${event.playerName} احیا شد`;
      case 'day_start':
        return `روز ${dayNumber} شروع شد`;
      case 'day_complete':
        return `روز ${dayNumber} تمام شد`;
      default:
        return event.description || 'رویداد نامشخص';
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">
            تاریخچه روز {dayNumber}
            {isCurrentDay && <span className="badge bg-primary ms-2">روز جاری</span>}
          </h6>
        </div>
        <div className="card-body">
          <p className="text-muted mb-0">هیچ رویدادی ثبت نشده</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h6 className="mb-0">
          تاریخچه روز {dayNumber} ({events.length} رویداد)
          {isCurrentDay && <span className="badge bg-primary ms-2">روز جاری</span>}
        </h6>
      </div>
      <div className="card-body">
        <div className="timeline">
          {events.map((event, index) => (
            <div key={event.id || index} className="timeline-item d-flex mb-2">
              <div className="timeline-icon me-2">
                <span style={{ fontSize: '1.2em' }}>{getEventIcon(event.type)}</span>
              </div>
              <div className="timeline-content flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <span className="text-dark">{getEventText(event)}</span>
                  <small className="text-muted">{event.timestamp}</small>
                </div>
                {event.details && (
                  <small className="text-muted d-block mt-1">{event.details}</small>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayHistory;
