const Groq = require('groq-sdk')
const { Vehicle, Driver, Trip, FuelLog, Expense, Maintenance } = require('../models')

let groq
const getGroq = () => {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return groq
}

const chat = async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ message: 'Message is required.' })
    }

    // Fetch real-time fleet data from DB
    const [
      totalVehicles,
      availableVehicles,
      vehiclesOnTrip,
      vehiclesInShop,
      totalDrivers,
      availableDrivers,
      suspendedDrivers,
      activeTrips,
      pendingTrips,
      completedTrips,
      totalExpenses,
      totalFuelLogs,
      totalMaintenance,
    ] = await Promise.all([
      Vehicle.count(),
      Vehicle.count({ where: { status: 'available' } }),
      Vehicle.count({ where: { status: 'on_trip' } }),
      Vehicle.count({ where: { status: 'in_shop' } }),
      Driver.count(),
      Driver.count({ where: { status: 'available' } }),
      Driver.count({ where: { status: 'suspended' } }),
      Trip.count({ where: { status: 'active' } }),
      Trip.count({ where: { status: 'pending' } }),
      Trip.count({ where: { status: 'completed' } }),
      Expense.sum('amount'),
      FuelLog.sum('total_cost'),
      Maintenance.count({ where: { status: 'in_progress' } }),
    ])

    const fleetData = {
      vehicles: { total: totalVehicles, available: availableVehicles, on_trip: vehiclesOnTrip, in_shop: vehiclesInShop },
      drivers: { total: totalDrivers, available: availableDrivers, suspended: suspendedDrivers },
      trips: { active: activeTrips, pending: pendingTrips, completed: completedTrips },
      finances: { total_expenses: totalExpenses || 0, total_fuel_cost: totalFuelLogs || 0 },
      maintenance: { in_progress: totalMaintenance },
      fleet_utilization: totalVehicles > 0 ? ((vehiclesOnTrip / totalVehicles) * 100).toFixed(1) + '%' : '0%',
    }

    const systemPrompt = `You are a smart Fleet Management AI Assistant. 
You have access to real-time fleet data. Answer user questions clearly and concisely based on this data.
Always be helpful, professional, and to the point.
If asked something outside fleet management, politely redirect to fleet topics.

Current Fleet Data:
${JSON.stringify(fleetData, null, 2)}`

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 512,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('Chat error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = { chat }
