import { useState } from 'react'
import './App.css'

// Trips data with destinations and costs
const trips = [
  { destination: "Georgia", cost: 4000 },
  { destination: "South Africa", cost: 8400 }
]

// Maximum goal for the progress bar
const GOAL_AMOUNT = 10000

function App() {
  // Dummy variable to test progress bar - change this value to see the bar fill
  const [totalPledged, setTotalPledged] = useState(2500)
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    amount: '',
    paymentMethod: '',
    email: ''
  })

  // Calculate progress percentage
  const progressPercentage = Math.min((totalPledged / GOAL_AMOUNT) * 100, 100)

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    const pledgeAmount = parseFloat(formData.amount) || 0
    setTotalPledged(prev => prev + pledgeAmount)
    // Reset form
    setFormData({
      fullName: '',
      amount: '',
      paymentMethod: '',
      email: ''
    })
    alert(`Thank you ${formData.fullName}! Your pledge of $${pledgeAmount.toLocaleString()} has been recorded.`)
  }

  return (
    <div className="pledge-container">
      {/* Header */}
      <header className="pledge-header">
        <div className="hearts-decoration">💕</div>
        <h1 className="pledge-title">Gedeon & Katie</h1>
        <h2 className="pledge-subtitle">Honeymoon Pledge</h2>
      </header>

      {/* Progress Section */}
      <section className="progress-section">
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-value">${totalPledged.toLocaleString()}</span>
            <span className="stat-label">Pledged</span>
          </div>
          <div className="stat">
            <span className="stat-value">${GOAL_AMOUNT.toLocaleString()}</span>
            <span className="stat-label">Goal</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
          
          {/* Checkpoints */}
          <div className="checkpoints">
            {trips.map((trip, index) => {
              const checkpointPosition = (trip.cost / GOAL_AMOUNT) * 100
              const isReached = totalPledged >= trip.cost
              return (
                <div 
                  key={index}
                  className={`checkpoint ${isReached ? 'reached' : ''}`}
                  style={{ left: `${checkpointPosition}%` }}
                >
                  <div className="checkpoint-marker">
                    {isReached ? '✓' : '○'}
                  </div>
                  <div className="checkpoint-info">
                    <span className="checkpoint-destination">{trip.destination}</span>
                    <span className="checkpoint-cost">${trip.cost.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
            {/* End goal marker */}
            <div 
              className={`checkpoint goal-checkpoint ${totalPledged >= GOAL_AMOUNT ? 'reached' : ''}`}
              style={{ left: '100%' }}
            >
              <div className="checkpoint-marker goal-marker">
                {totalPledged >= GOAL_AMOUNT ? '🎉' : '🎯'}
              </div>
              <div className="checkpoint-info">
                <span className="checkpoint-destination">Goal</span>
                <span className="checkpoint-cost">${GOAL_AMOUNT.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="test-controls">
          <label className="test-label">
            Test Progress (Dummy Variable):
            <input 
              type="range" 
              min="0" 
              max={GOAL_AMOUNT} 
              value={totalPledged}
              onChange={(e) => setTotalPledged(parseInt(e.target.value))}
              className="test-slider"
            />
            <span className="test-value">${totalPledged.toLocaleString()}</span>
          </label>
        </div>
      </section>

      {/* Pledge Form */}
      <section className="pledge-form-section">
        <h3 className="form-title">Make a Pledge</h3>
        <form onSubmit={handleSubmit} className="pledge-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Pledge Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">Preferred Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              required
            >
              <option value="">Select payment method</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card_payment">Card Payment</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            <span>Submit Pledge</span>
            <span className="btn-icon">💝</span>
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="pledge-footer">
        <p>Help us create amazing memories together! 💑</p>
      </footer>
    </div>
  )
}

export default App
