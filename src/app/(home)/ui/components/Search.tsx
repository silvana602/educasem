"use client";

import Link from "next/link";
// import Image from "next/image";
import React from "react";
import { IoSearch } from "react-icons/io5";

import "@/styles/styles.components/home-page/Search.css";

export const Search = () => {
  return (
    <section className="search-section">
      <div className="search-container">
        <label htmlFor="courseSearch" className="search-label">
          Buscar Curso
        </label>
        <div className="search-input-container">
          <input
            type="text"
            id="courseSearch"
            className="search-input"
            placeholder="Buscar curso..."
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            // onFocus={() => {
            //   if (searchResults.length > 0) {
            //     setShowModal(true);
            //   }
            // }}
          />
          <Link href="/" className="search-button" aria-label="buscar">
            <IoSearch size={25} />
          </Link>
        </div>
      </div>

      {/* Search Results Modal */}
      {/* {showModal && (
        <div className="search-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Resultados de búsqueda</h3>
              <button className="close-button" onClick={closeModal}>
                X
              </button>
            </div>
            <div className="search-results-list">
              {searchResults.map((course) => (
                <div key={course.id} className="search-result-item">
                  <div className="result-image">
                    <Image
                      src="/imgs/portada.jpg"
                      alt="portada"
                      width={500}
                      height={300}
                    />
                  </div>
                  <div className="result-content">
                    <h4 className="result-title">Título coincidente</h4>
                    <p className="result-instructor">Tutor del curso</p>
                    <div className="result-theme">Tema</div>
                    <div className="result-footer">
                      <span className="result-price">Precio: $$</span>
                      <button className="buy-button">Comprar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="seeMore-button">Ver más...</button>
            </div>
          </div>
        </div>
      )}
        
      {/* Modal Backdrop 
      {showModal && <div className="modal-backdrop" onClick={closeModal}></div>} */}
    </section>
  );
};

// export default homeSearch;
