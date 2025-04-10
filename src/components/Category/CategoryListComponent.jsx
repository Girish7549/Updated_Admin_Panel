import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ViewModalCategory from './ViewModalCategory'
import CategoryEditModal from './CategoryEditModal'
import DeleteCategoryModal from './DeleteCategoryModal'
import { Modal } from 'react-bootstrap'
import { axiosClients } from '../../Apis/api'
import { formatDate } from '../../utils/formatDate'
import Loader from '../../components/Loader'

function CategoryListComponent() {
  const [datas, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editToggleModal, setEditToggleModal] = useState(false)
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [zoomModal, setZoomModal] = useState(false)
  const [zoomedImageUrl, setZoomedImageUrl] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchData = async (page = 1) => {
    try {
      const response = await axiosClients.get(`/getAllCategories?page=${page}`)
      setData(response.data.data)
      setTotal(response.data.total)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage])

  const toggleEditModal = () => setEditToggleModal((prevState) => !prevState)
  const deleteToggle = (category) => {
    setSelectedCategory(category)
    setDeleteModal((prevState) => !prevState)
  }
  const toggle = () => setModal((prevState) => !prevState)
  const handleModal = (category) => {
    setSelectedCategory(category)
    toggle()
  }
  const handleEditModal = (category) => {
    setSelectedCategory(category)
    toggleEditModal()
  }
  const openZoomModal = (imageUrl) => {
    setZoomedImageUrl(imageUrl)
    setZoomModal(true)
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  const handlePageSelect = (page) => {
    if (page !== currentPage) fetchData(page)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) fetchData(currentPage + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) fetchData(currentPage - 1)
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="title-header option-title d-sm-flex d-block">
                <h5>Category List</h5>
                <div className="right-options">
                  <ul>
                    <li>
                      <Link className="btn btn-dashed" to="/addcategory">
                        Add Category
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {
                  datas.length <= 0 ? (
                    <Loader />
                  ) : (
                    <table className="table category-table dataTable no-footer" id="table_id">
                      <thead style={{ background: '#f5f5f5 !important' }}>
                        <tr>
                          <th>No.</th>
                          <th>Category Name</th>
                          <th>Created Date</th>
                          <th>Updated Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datas.map((data, index) => (
                          <tr key={data.category_id}>
                            <td>{index + 1 + (currentPage - 1) * itemsPerPage}.</td>
                            <td>{data.category_name}</td>
                            <td>{formatDate(data.created_at)}</td>
                            <td>{formatDate(data.updated_at)}</td>
                            <td>
                              <span className={`badge ${data.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                {data.status}
                              </span>
                            </td>
                            <td>
                              <ul>
                                <li onClick={() => handleModal(data)}>
                                  <Link><i className="ri-eye-line" /></Link>
                                </li>
                                <li onClick={() => handleEditModal(data)}>
                                  <Link><i className="ri-edit-box-line" /></Link>
                                </li>
                                <li onClick={() => deleteToggle(data)}>
                                  <Link><i className="ri-delete-bin-line" /></Link>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                }
              </div>

              {/* Pagination Controls */}
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-end mt-4">
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, idx) => (
                    <li
                      key={idx}
                      className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
                    >
                      <button className="page-link" onClick={() => handlePageSelect(idx + 1)}>
                        {idx + 1}
                      </button>
                    </li>
                  ))}
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {selectedCategory && (
        <>
          <ViewModalCategory modal={modal} toggle={toggle} data={selectedCategory} />
          <CategoryEditModal
            show={editToggleModal}
            handleClose={toggleEditModal}
            data={selectedCategory}
            onSave={() => fetchData(currentPage)}
          />
          <DeleteCategoryModal
            modal={deleteModal}
            toggle={deleteToggle}
            onSave={() => fetchData(currentPage)}
            data={selectedCategory}
          />
        </>
      )}

      {/* Bootstrap Modal for Image Zoom */}
      <Modal show={zoomModal} onHide={() => setZoomModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Category Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img src={zoomedImageUrl} alt="Zoomed" className="img-fluid" />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CategoryListComponent
