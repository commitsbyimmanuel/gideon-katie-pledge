import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabaseClient'

// Trips data with destinations and costs
const trips = [
  { destination: "Georgia", cost: 4800 },
  { destination: "Cape Town", cost: 8600 }
]

// Total combined cost for progress calculation
const TOTAL_TRIP_COST = trips.reduce((sum, trip) => sum + trip.cost, 0)

function App() {
  const [totalPledged, setTotalPledged] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    amount: '',
    paymentMethod: '',
    email: ''
  })

  // Fetch total pledged amount on mount
  useEffect(() => {
    fetchTotalPledged()
  }, [])

  // Fetch total pledged from Supabase
  const fetchTotalPledged = async () => {
    try {
      const { data, error } = await supabase
        .from('pledge')
        .select('amount')
      
      if (error) {
        console.error('Error fetching pledges:', error)
        return
      }

      // Calculate sum of all pledge amounts
      const total = data.reduce((sum, pledge) => sum + (pledge.amount || 0), 0)
      setTotalPledged(total)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate progress percentage (based on total trip costs, but can exceed 100%)
  const progressPercentage = Math.min((totalPledged / TOTAL_TRIP_COST) * 100, 100)

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const pledgeAmount = parseFloat(formData.amount) || 0

    try {
      // Insert pledge into Supabase
      const { error } = await supabase
        .from('pledge')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          amount: pledgeAmount,
          payment_method: formData.paymentMethod
        })

      if (error) {
        console.error('Error inserting pledge:', error)
        alert('There was an error submitting your pledge. Please try again.')
        return
      }

      // Update local state
      setTotalPledged(prev => prev + pledgeAmount)
      
      // Reset form
      setFormData({
        fullName: '',
        amount: '',
        paymentMethod: '',
        email: ''
      })
      
      alert('Thank you ' + formData.fullName + '! Your pledge of AED ' + pledgeAmount.toLocaleString() + ' has been recorded.')
    } catch (err) {
      console.error('Error:', err)
      alert('There was an error submitting your pledge. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
            <span className="stat-value">
              {isLoading ? '...' : 'AED ' + totalPledged.toLocaleString()}
            </span>
            <span className="stat-label">Pledged So Far</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: progressPercentage + '%' }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
          
          {/* Checkpoints */}
          <div className="checkpoints">
            {trips.map((trip, index) => {
              // Position checkpoints
              const checkpointPosition = index === 0 ? 35 : 63
              const isReached = totalPledged >= trip.cost
              return (
                <div 
                  key={index}
                  className={'checkpoint ' + (isReached ? 'reached' : '')}
                  style={{ left: checkpointPosition + '%' }}
                >
                  <div className="checkpoint-marker">
                    {isReached ? '✓' : '○'}
                  </div>
                  <div className="checkpoint-info">
                    <span className="checkpoint-destination">{trip.destination}</span>
                    <span className="checkpoint-cost">AED {trip.cost.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h3 className="about-title">About This Pledge</h3>
        <div className="about-content">
          <p>
            We are so grateful that you guys are considering chipping in to make Gedeon & Katie's Honeymoon special!
            Based on how much they receive through this, they will be able to cover the cost of going to Georgia for a week or <strong>ideally</strong> Cape Town!
            <br /><br />The above estimates cover flights, stay and visa costs. 
            Any extras will be passed on to the couple and will go towards food, activities or other expenses during their trip.
            <br /><br />Payments can be collected at ~ Feb or March. Please DM us (Immanuel or Joana) for any questions or accomodations.
          </p>
          <p className="about-note">
            Thanks for helping us make this momerable for Gedeon & Katie! 💝 
            <br />
            -Love, the Varghese-Lima Family
          </p>
        </div>
      </section>

      {/* Pledge Form */}
      <section className="pledge-form-section">
        <h3 className="form-title">Make a Pledge</h3>
        <form onSubmit={handleSubmit} className="pledge-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
                disabled={isSubmitting}
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
                placeholder="Your email"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Pledge Amount (AED)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Amount"
                min="1"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              >
                <option value="">Select method</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="card_payment">Card Payment</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Submitting...' : 'Submit Pledge'}</span>
            <span className="btn-icon">💝</span>
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="pledge-footer">
        Thanks for helping us make this momerable for Gedeon & Katie! 💝 
        <br />
        -Love, the Varghese-Lima Family 💑
      </footer>
    </div>
  )
}

export default App
