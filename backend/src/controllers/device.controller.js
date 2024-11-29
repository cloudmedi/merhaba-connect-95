import Device from '../models/Device.js';

// Register new device
export const registerDevice = async (req, res) => {
  try {
    const { name, category, ipAddress, location } = req.body;
    
    const device = await Device.create({
      name,
      category,
      ipAddress,
      location,
      status: 'offline',
      systemInfo: {},
      schedule: {}
    });

    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all devices
export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find({});
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get device by ID
export const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update device
export const updateDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete device
export const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    await device.remove();
    res.json({ message: 'Device removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update device status
export const updateDeviceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const device = await Device.findById(req.params.id);
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.status = status;
    device.lastSeen = new Date();
    await device.save();

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};