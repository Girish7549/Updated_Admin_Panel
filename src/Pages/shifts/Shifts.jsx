import React, { useEffect, useState } from 'react'
import { Modal, Button, SelectPicker, DatePicker, TagPicker } from 'rsuite';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../../components/index';
import { Link } from 'react-router-dom';
import { axiosClients } from '../../Apis/api';
import { toast } from 'react-toastify';
import { FaCalendar } from 'react-icons/fa';
import Loader from '../../components/Loader';

const Shifts = () => {
  const [shifts, setShifts] = useState([])
  const [years, setYears] = useState([])
  const [selectedShift, setSelectedShift] = useState(null)
  const [loading, setLoading] = useState(false)

  const statusData = ['Active', 'Inactive'].map((item) => ({ label: item, value: item }))
  const languageData = ['English', 'Hindi'].map((item) => ({ label: item, value: item }))

  const [formData, setFormData] = useState({
    shift_name: '',
    year_id: '',
    shift_date_time: '',
    status: '',
    languageJson: []
  })

  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleClose = () => {
    setOpen(false)
    setOpenEdit(false)
    setOpenDelete(false)
  }

  const handleOpen = (shift) => {
    setSelectedShift(shift)
    setOpen(true)
  }

  const handleEditModal = (shift) => {
    setSelectedShift(shift)
    setFormData({
      shift_name: shift.shift_name || '',
      year_id: shift.year_id || '',
      shift_date_time: shift.shift_date_time || '',
      status: shift.status || '',
      languageJson: Array.isArray(shift.language) ? shift.language : typeof shift.language === 'string' ? [shift.language] : []
    })
    setOpenEdit(true)
  }

  const handleDeleteModal = (shift) => {
    setSelectedShift(shift)
    setOpenDelete(true)
  }

  async function fetchYears() {
    try {
      const response = await axiosClients.get("/years");
      const mappedYears = response.data.data.map((item) => ({
        label: item.year,
        value: item.year_id,
      }));
      setYears(mappedYears);
    } catch (error) {
      console.error("Error fetching years:", error);
      toast.error("Error fetching years!", { position: "top-right" });
    }
  }

  async function fetchShift() {
    try {
      const response = await axiosClients.get("/shifts");
      if (years.length === 0) return;

      const shiftMapped = response.data.data.map(item => ({
        ...item,
        year: years.find(year => year.value == item.year_id)?.label || "YYYY",
        language: Array.isArray(item.language)
          ? item.language
          : typeof item.language === 'string'
            ? [item.language]
            : []
      }));

      setShifts(shiftMapped);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Error fetching shifts!", { position: "top-right" });
    }
  }

  useEffect(() => {
    fetchYears()
  }, [])

  useEffect(() => {
    if (years.length > 0) fetchShift()
  }, [years])

  async function handleDelete(e) {
    e.preventDefault()
    if (!selectedShift?.shift_id) return

    setLoading(true)
    try {
      const response = await axiosClients.delete(`/shifts/${selectedShift.shift_id}`)
      if (response.status === 200) {
        toast.success("Shift deleted successfully!", { position: "top-right" })
        fetchYears()
      } else {
        toast.error("Something went wrong!", { position: "top-right" })
      }
    } catch (error) {
      console.error("Error deleting shift:", error)
      toast.error("Failed to delete shift!", { position: "top-right" })
    } finally {
      setLoading(false)
      setOpenDelete(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedShift?.shift_id) return

    setLoading(true)
    try {
      const response = await axiosClients.put(`/shifts/${selectedShift.shift_id}`, formData)
      if (response.status === 200) {
        toast.success("Shift updated successfully!", { position: "top-right" })
      } else {
        toast.error("Something went wrong!", { position: "top-right" })
      }
    } catch (error) {
      console.error("Error updating shift:", error)
      toast.error("Failed to update shift!", { position: "top-right" })
    } finally {
      setLoading(false)
      fetchYears()
      setOpenEdit(false)
    }
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="container-fluid">
            <div className="card card-table">
              <div className="card-body">
                <div className="title-header d-sm-flex d-block">
                  <h4>Shifts List</h4>
                  <div className="right-options">
                    <ul>
                      <li>
                        <Link className="btn btn-dashed" to="/add-shift">Add Shift</Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {shifts.length <= 0 ? (
                    <Loader />
                  ) : (
                    <table className="table category-table">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Year</th>
                          <th>Shift Name</th>
                          <th>Language</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shifts.map((data, index) => (
                          <tr key={data.shift_id}>
                            <td>{index + 1}.</td>
                            <td>{data.year}</td>
                            <td>{`${data.shift_name.slice(0, 40)}...`}</td>
                            <td>{Array.isArray(data.language) ? data.language.join(", ") : "-"}</td>
                            <td>{data.shift_date_time}</td>
                            <td>
                              <span className={`badge ${data.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                {data.status}
                              </span>
                            </td>
                            <td>
                              <ul>
                                <li onClick={() => handleOpen(data)}><Link><i className="ri-eye-line" /></Link></li>
                                <li onClick={() => handleEditModal(data)}><Link><i className="ri-edit-box-line" /></Link></li>
                                <li onClick={() => handleDeleteModal(data)}><Link><i className="ri-delete-bin-line" /></Link></li>
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* View Modal */}
            <Modal size="md" open={open} onClose={handleClose}>
              <Modal.Header>
                <Modal.Title>Shift Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedShift ? (
                  <table className="table table-bordered">
                    <tbody>
                      <tr><th>Year</th><td>{selectedShift.year}</td></tr>
                      <tr><th>Shift Date & Time</th><td>{selectedShift.shift_date_time}</td></tr>
                      <tr><th>Status</th><td>{selectedShift.status}</td></tr>
                      <tr><th>Languages</th><td>{Array.isArray(selectedShift.language) ? selectedShift.language.join(', ') : '-'}</td></tr>
                      <tr><th>Created At</th><td>{new Date(selectedShift.created_at).toLocaleString()}</td></tr>
                      <tr><th>Updated At</th><td>{new Date(selectedShift.updated_at).toLocaleString()}</td></tr>
                    </tbody>
                  </table>
                ) : (
                  <p>Loading shift details...</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleClose} appearance="primary">Close</Button>
              </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal size="md" open={openEdit} onClose={handleClose}>
              <Modal.Header>
                <Modal.Title>Edit Shift Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="mb-3">
                    <label>Shift Name</label>
                    <input type="text" className="form-control" value={formData.shift_name} onChange={(e) =>
                      setFormData(prev => ({ ...prev, shift_name: e.target.value }))
                    } />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Year</label>
                      <SelectPicker
                        data={years}
                        value={formData.year_id}
                        onChange={(value) => setFormData(prev => ({ ...prev, year_id: value }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Time</label>
                      <DatePicker
                        format="EEEE, dd MMM yyyy hh:mm:ss aa"
                        caretAs={FaCalendar}
                        onChange={(value) =>
                          setFormData(prev => ({
                            ...prev,
                            shift_date_time: value ? value.toLocaleString() : ''
                          }))
                        }
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Status</label>
                      <SelectPicker
                        data={statusData}
                        value={formData.status}
                        onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Language</label>
                      <TagPicker
                        data={languageData}
                        value={formData.languageJson}
                        onChange={(value) => setFormData(prev => ({ ...prev, languageJson: value }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleClose} appearance="subtle">Cancel</Button>
                <Button onClick={handleSubmit} appearance="primary">
                  {loading ? 'Submitting...' : 'Save Changes'}
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal open={openDelete} onClose={handleClose}>
              <Modal.Header>
                <Modal.Title style={{ color: 'red' }}>Delete Shift</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this shift?
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleDelete} appearance="primary">Delete</Button>
                <Button onClick={handleClose} appearance="subtle">Cancel</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default Shifts
