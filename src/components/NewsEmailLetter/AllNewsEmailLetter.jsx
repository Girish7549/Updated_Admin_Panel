import React, { useEffect, useState } from 'react';
import ViewNewsEmailLetter from './ViewNewsEmailLetter';
import DeleteNewsEmailLetter from './DeleteNewsEmailLetter';
import { axiosClients } from '../../Apis/api';
import Loader from '../Loader';

function NewsEmailLetter() {
  const [datas, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleModal = () => setModal(!modal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    toggleModal();
  };

  const deleteToggle = (user) => {
    setSelectedUser(user);
    toggleDeleteModal();
  };

  const fetchData = async (page = 1) => {
    try {
      const response = await axiosClients.get(`/years?page=${page}`);
      setData(response.data.data);
      setTotalItems(response.data.total);
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      fetchData(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchData(currentPage - 1);
    }
  };

  const handlePageSelect = (page) => {
    if (page !== currentPage) {
      fetchData(page);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="title-header option-title d-sm-flex d-block">
                <h5>Year List</h5>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {
                  datas.length <= 0 ? (
                    <Loader />
                  ) : (
                    <table className="table category-table dataTable no-footer" id="table_id">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Year</th>
                          <th>Subcategory Name</th>
                          <th>Subcategory ID</th>
                          <th>Status</th>
                          <th>Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datas.map((data, index) => (
                          <tr key={index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{data.year}</td>
                            <td>{data.subcategory_name}</td>
                            <td>{data.subcategory_id}</td>
                            <td>
                              <span className={`badge ${data.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                {data.status}
                              </span>
                            </td>
                            <td>
                              <ul>
                                <li onClick={() => handleViewUser(data)} style={{ cursor: 'pointer' }}>
                                  <a>
                                    <i className="ri-eye-line" />
                                  </a>
                                </li>
                                <li onClick={() => deleteToggle(data)} style={{ cursor: 'pointer' }}>
                                  <a>
                                    <i className="ri-delete-bin-line text-danger" />
                                  </a>
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
                  {[...Array(totalPages)].map((_, idx) => {
                    if (idx < 6) {
                      return (
                        <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => handlePageSelect(idx + 1)}>
                            {idx + 1}
                          </button>
                        </li>
                      );
                    }
                    if (idx === 6) {
                      return (
                        <li key={idx} className="page-item">
                          <span className="page-link">+</span>
                        </li>
                      );
                    }
                    return null;
                  })}
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

      {selectedUser && (
        <>
          <ViewNewsEmailLetter modal={modal} toggle={toggleModal} data={selectedUser} fetchData={() => fetchData(currentPage)} />
          <DeleteNewsEmailLetter modal={deleteModal} toggle={toggleDeleteModal} data={selectedUser} onSave={() => fetchData(currentPage)} />
        </>
      )}
    </div>
  );
}

export default NewsEmailLetter;
