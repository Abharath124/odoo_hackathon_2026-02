const { Driver } = require('../models')

// Add Driver
const addDriver = async (req, res) => {
  try {
    const { name, license_number, category, license_expiry, contact, safety_score, status } = req.body

    if (!name || !license_number || !category || !license_expiry || !contact) {
      return res.status(400).json({ message: 'name, license_number, category, license_expiry, and contact are required.' })
    }

    const existingDriver = await Driver.findOne({ where: { license_number } })
    if (existingDriver) {
      return res.status(409).json({ message: 'Driver with this license number already exists.' })
    }

    if (status) {
      const validStatuses = ['available', 'on_trip', 'suspended']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Status must be available, on_trip, or suspended.' })
      }
    }

    const driver = await Driver.create({
      name,
      license_number,
      category,
      license_expiry,
      contact,
      safety_score: safety_score !== undefined ? safety_score : 100,
      status: status || 'available',
    })

    return res.status(201).json({
      message: 'Driver added successfully.',
      driver,
    })
  } catch (error) {
    console.error('Add driver error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll()
    return res.status(200).json(drivers)
  } catch (error) {
    console.error('Get all drivers error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Get single driver
const getDriverById = async (req, res) => {
  try {
    const { id } = req.params
    const driver = await Driver.findByPk(id)

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' })
    }

    return res.status(200).json(driver)
  } catch (error) {
    console.error('Get driver error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Update driver
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params
    const { name, license_number, category, license_expiry, contact, safety_score, status } = req.body

    const driver = await Driver.findByPk(id)
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' })
    }

    if (license_number && license_number !== driver.license_number) {
      const existingDriver = await Driver.findOne({ where: { license_number } })
      if (existingDriver) {
        return res.status(409).json({ message: 'Driver with this license number already exists.' })
      }
      driver.license_number = license_number
    }

    if (name) driver.name = name
    if (category) driver.category = category
    if (license_expiry) driver.license_expiry = license_expiry
    if (contact) driver.contact = contact
    if (safety_score !== undefined) driver.safety_score = safety_score

    if (status) {
      const validStatuses = ['available', 'on_trip', 'suspended']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Status must be available, on_trip, or suspended.' })
      }
      driver.status = status
    }

    await driver.save()

    return res.status(200).json({
      message: 'Driver updated successfully.',
      driver,
    })
  } catch (error) {
    console.error('Update driver error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Delete driver
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params
    const driver = await Driver.findByPk(id)

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' })
    }

    await driver.destroy()

    return res.status(200).json({ message: 'Driver deleted successfully.' })
  } catch (error) {
    console.error('Delete driver error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Suspend driver (status -> suspended)
const suspendDriver = async (req, res) => {
  try {
    const { id } = req.params
    const driver = await Driver.findByPk(id)

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' })
    }

    driver.status = 'suspended'
    await driver.save()

    return res.status(200).json({
      message: 'Driver suspended successfully.',
      driver,
    })
  } catch (error) {
    console.error('Suspend driver error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Renew license (update license_expiry)
const renewLicense = async (req, res) => {
  try {
    const { id } = req.params
    const { license_expiry } = req.body

    if (!license_expiry) {
      return res.status(400).json({ message: 'license_expiry is required.' })
    }

    const driver = await Driver.findByPk(id)
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' })
    }

    driver.license_expiry = license_expiry
    await driver.save()

    return res.status(200).json({
      message: 'Driver license renewed successfully.',
      driver,
    })
  } catch (error) {
    console.error('Renew license error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  addDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  suspendDriver,
  renewLicense,
}
