import React from 'react'
import axios from "axios";

const API = "https://api.aimostore.shop";
// const API = "http://127.0.0.1:8000";

const API_BASEURL = `${API}/api`;

const axiosInstance = axios.create({
    baseURL: API_BASEURL,
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
});

const API_ENDPOINTS = {

  // image
  getImages: `${API_BASEURL}/image`,
  uploadImage: `${API_BASEURL}/image`,
  deleteImage: `${API_BASEURL}/image`,

  // information
  getInformation: `${API_BASEURL}/information`,
  createInformation: `${API_BASEURL}/information`,
  updateInformation: `${API_BASEURL}/information`,
  deleteInformation: `${API_BASEURL}/information`,

  // achievement
  getAchievement: `${API_BASEURL}/achievement`,
  createAchievement: `${API_BASEURL}/achievement`,
  updateAchievement: `${API_BASEURL}/achievement`,
  deleteAchievement: `${API_BASEURL}/achievement`,

  // social
  getSocial: `${API_BASEURL}/social`,
  createSocial: `${API_BASEURL}/social`,
  updateSocial: `${API_BASEURL}/social`,
  deleteSocial: `${API_BASEURL}/social`,

  // resume
  getResume: `${API_BASEURL}/resume`,
  createResume: `${API_BASEURL}/resume`,
  updateResume: `${API_BASEURL}/resume`,
  deleteResume: `${API_BASEURL}/resume`,

  // skill
  getSkill: `${API_BASEURL}/skill`,
  createSkill: `${API_BASEURL}/skill`,
  updateSkill: `${API_BASEURL}/skill`,
  deleteSkill: `${API_BASEURL}/skill`,

  // text
  getText: `${API_BASEURL}/text`,
  createText: `${API_BASEURL}/text`,
  updateText: `${API_BASEURL}/text`,
  deleteText: `${API_BASEURL}/text`,

  // portfolio
  getPortfolio: `${API_BASEURL}/portfolio`,
  createPortfolio: `${API_BASEURL}/portfolio`,
  updatePortfolio: `${API_BASEURL}/portfolio`,
  deletePortfolio: `${API_BASEURL}/portfolio/visible`,
  updatePortfolioOrder: `${API_BASEURL}/portfolio/reorder`,

  // blog
  getBlog: `${API_BASEURL}/blog`,
  createBlog: `${API_BASEURL}/blog`,
  updateBlog: `${API_BASEURL}/blog`,
  deleteBlog: `${API_BASEURL}/blog/visible`,
  updateBlogOrder: `${API_BASEURL}/blog/reorder`,

  // email
  getEmail: `${API_BASEURL}/email`,
  createEmail: `${API_BASEURL}/email`,
  updateEmail: `${API_BASEURL}/email`,
  deleteEmail: `${API_BASEURL}/email/visible`,

  // login
  LoginUser: `${API_BASEURL}/login`,

  // logout
  LogOutUser: `${API_BASEURL}/logout`,

  // check-auth
  CheckAuth: `${API_BASEURL}/check-auth`,

};

export {axiosInstance, API_BASEURL, API_ENDPOINTS, API };