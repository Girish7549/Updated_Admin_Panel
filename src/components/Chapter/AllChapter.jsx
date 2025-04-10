import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosClients } from "../../Apis/api";
import ShowChapter from "./ShowChapter";
import DeleteChapter from "./DeleteChapter";
import EditChapter from "./EditChapter";
import Loader from "../Loader";

function AllTestimonial() {
  const [datas, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [editToggleModal, setEditToggleModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async (page = 1) => {
    try {
      const response = await axiosClients.get(`/getAllChapters?page=${page}`);
      setData(response.data.data);
      setTotal(response.data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchData(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchData(currentPage - 1);
    }
  };

  const handlePageSelect = (page) => {
    if (page !== currentPage) fetchData(page);
  };

  const toggleModal = () => setModal(!modal);
  const deleteToggle = (chapter) => {
    setSelectedChapter(chapter);
    setDeleteModal(!deleteModal);
  };

  const handleViewBanner = (chapter) => {
    setSelectedChapter(chapter);
    toggleModal();
  };

  const editToggle = () => setEditToggleModal(!editToggleModal);
  const handleEditModal = (chapter) => {
    setSelectedChapter(chapter);
    editToggle();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="title-header option-title d-sm-flex d-block">
                <h5>Chapter List</h5>
                <div className="right-options">
                  <ul>
                    <li>
                      <Link className="btn btn-dashed" to="/addchapter">
                        Add Chapter
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="table-responsive" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {
                  datas.length <= 0 ?
                    (<Loader />)
                    :
                    (
                      <table className="table category-table dataTable no-footer" id="table_id">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Chapter</th>
                            <th>Unit Id</th>
                            <th>Year</th>
                            <th>Total</th>
                            <th>Avg</th>
                            <th>Weightage First</th>
                            <th>Weightage Second</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {datas.map((item, i) => (
                            <tr key={i}>
                              <td>{(currentPage - 1) * itemsPerPage + i + 1}.</td>
                              <td>{item.chapter_name}</td>
                              <td>{item.unit_id}</td>
                              <td>{item.year}</td>
                              <td>{item.total}</td>
                              <td>{item.avg}</td>
                              <td>{item.weightage_first}</td>
                              <td>{item.weightage_second}</td>
                              <td>
                                <span className={`badge ${item.status === "active" ? "bg-success" : "bg-danger"}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td>
                                <ul className="d-flex gap-3">
                                  <li onClick={() => handleViewBanner(item)}>
                                    <Link className="text-warning">
                                      <i className="ri-eye-line"></i>
                                    </Link>
                                  </li>
                                  <li onClick={() => handleEditModal(item)}>
                                    <Link>
                                      <i className="ri-edit-box-line text-success"></i>
                                    </Link>
                                  </li>
                                  <li onClick={() => deleteToggle(item)}>
                                    <Link>
                                      <i className="ri-delete-bin-line text-danger"></i>
                                    </Link>
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
                    <button className="page-link" onClick={handlePrevPage} disabled={currentPage === 1}>
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
                    <button className="page-link" onClick={handleNextPage} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {selectedChapter && (
        <>
          <ShowChapter modal={modal} toggle={toggleModal} data={selectedChapter} />
          <EditChapter modal={editToggleModal} toggle={editToggle} data={selectedChapter} onSave={() => fetchData(currentPage)} />
          <DeleteChapter modal={deleteModal} toggle={deleteToggle} data={selectedChapter} onSave={() => fetchData(currentPage)} />
        </>
      )}
    </div>
  );
}

export default AllTestimonial;
