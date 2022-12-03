import axios from "axios";
import sendRequest from "./RequestService";
import Utils from "../utils";


class ApiService {
  static seenAll(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/notifications/seenAll', 'post', data).then(res => resolve(res)).catch(err => reject(err));
    })
  }

  static getProjects(data, config) {
    return sendRequest("/api/projects", "get", data, config)
  }

  static async getSalaryId(projectId, config) {
    return await sendRequest("/api/salary/" + projectId, "get", {}, config)
  }


  static getSalary(data, config) {
    return sendRequest("/api/salary", "get", data, config)
  }

  static addSalary(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/salary/add', 'post', data).then(res => resolve(res)).catch(err => reject(err));
    })
  }

  static async updateSalary(salaryId, data) {
    return await sendRequest("/api/salary/edit/" + salaryId, "post", data)
  }

  static async getUserDepartment(data, config) {
    return await sendRequest("/api/user-department", "get", data, config);
  }

  static addDepartment(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/departments/add', 'post', data).then(res => resolve(res)).catch(err => reject(err));
    })
  }

  static addUserDepartment(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/user-department/add', 'post', data).then(res => resolve(res)).catch(err => reject(err));
    })
  }

  static removeUserDepartment(memberId, data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/user-department/delete/' + memberId, 'post', data).then(res => resolve(res)).catch(err => reject(err));
    })
  }


  static handleReaction(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/reactions/handle', 'post', data).then(res => resolve(res)).catch(err => reject(err));
    })
  }

  static login(data) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/auth/login`, data).then(res => resolve(res)).catch(err => reject(err));
    })
  }

  static getSelfProjects(uid, page, limit, sortBy, name) {
    const query = name ? Utils.convertParams({page, limit, sortBy, name}) : Utils.convertParams({
      page,
      limit,
      sortBy
    });
    return new Promise((resolve, reject) => {
      sendRequest(`/api/users/self-projects/${query}`, 'get').then(res => resolve(res)).catch(err => reject(err));
    })
  }

  static addDeviceToken(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/deviceTokens/add', 'post', data).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  static updateSample(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/reports/sample/update', 'post', data).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  static addNotification(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/notifications/add', 'post', data).then(res => resolve(res)).catch(err => reject(err))
    });
  }

  static sendToAll(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/send-notifications/sendToAll', 'post', data).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  static sendToRole(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/send-notifications/sendToRole', 'post', data).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  static sendToOne(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/send-notifications/sendToOne', 'post', data).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  static addSample(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/reports/sample/submit', 'post', data).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  static async getDeviceToken(data, config) {
    return await sendRequest("/api/deviceTokens", "get", data, config);
  }

  static async getReports(data, config) {
    return await sendRequest("/api/reports", "get", data, config);
  }


  static getReport(reportId) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/reports/' + reportId, 'get').then(res => resolve(res)).catch(err => reject(err))
    });
  }

  static addReport(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/reports/submit', 'post', data).then(res => resolve(res)).catch(err => reject(err))
    })
  }

  static async deleteReport(reportId, config) {
    return await sendRequest("/api/reports/delete/" + reportId, "post", {}, config);
  }

  static register(data) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/auth/register`, data).then(res => resolve(res)).catch(err => reject(err));
    })
  }

  static getSample() {
    return new Promise((resolve, reject) => {
      sendRequest('/api/reports/sample', 'get').then(res => resolve(res)).catch(err => reject(err))
    })
  }

  static addProject(data) {
    return new Promise((resolve, reject) => {
      sendRequest("/api/projects/add", "post", data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static async getProjectInfo(projectId, config) {
    return await sendRequest("/api/projects/" + projectId, "get", {}, config)
  }

  static async deleteProject(projectId, config) {
    return await sendRequest("/api/projects/delete/" + projectId, "post", {}, config)
  }

  static getGitLabInfo(gitLabId, excludedProject) {
    return new Promise((resolve, reject) => {
      sendRequest("/api/projects/check-gitlab-id", "post", {
        projectId: gitLabId,
        excludedProject: excludedProject
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  }

  static updateProject(projectId, data) {
    return new Promise((resolve, reject) => {
      sendRequest("/api/projects/update/" + projectId, "post", data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static async assignMembersToProject(projectId, data, config) {
    return await sendRequest("/api/projects/assign-members/" + projectId, "post", data, config);
  }

  static async removeMembersFromProject(projectId, data, config) {
    return await sendRequest("/api/projects/remove-members/" + projectId, "post", data, config);
  }

  static async updateMembersPermission(projectId, data, config) {
    return await sendRequest("/api/projects/update-member/" + projectId, "post", data, config);
  }

  static async getMembersFromProject(projectId) {
    return await sendRequest("/api/projects/members/" + projectId, "get", {})
  }

  static async getMembersFromDepartment(projectId) {
    return await sendRequest("/api/user-department/" + projectId, "get", {})
  }


  static refreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/auth/refresh-tokens`, {refreshToken}).then(res => resolve(res)).catch(err => reject(err));
    })
  }

  static async logout(refreshToken) {
    return await sendRequest("/api/auth/logout", 'post', refreshToken);
  }

  static getUsers(data, config) {
    return sendRequest("/api/users", "get", data, config)
  }

  static async addUser(data) {
    return await sendRequest("/api/users/add", "post", data)
  }

  static async getUser(userId, config) {
    return await sendRequest("/api/users/" + userId, 'get', {}, config)
  }

  static async deleteUser(userId) {
    return await sendRequest("/api/users/delete/" + userId, 'post')
  }

  static async updateUser(userId, data) {
    return await sendRequest("/api/users/update/" + userId, "post", data)
  }

  static updateSelfProfile(data) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/users/update-self-profile', 'post', data).then(res => resolve(res)).catch(err => reject(err));
    })
  }

  static async getPosts(data, config) {
    return await sendRequest("/api/posts", 'get', data, config)
  }

  static async addPosts(data) {
    return await sendRequest("/api/posts/add", "post", data)
  }

  static async deletePosts(postId) {
    return await sendRequest("/api/posts/delete/" + postId, 'post')
  }

  static async getComments(data, config) {
    return await sendRequest("/api/comments", 'get', data, config)
  }

  static async getNotifications(data, config) {
    return await sendRequest("/api/notifications", 'get', data, config)
  }


  static async addComments(data) {
    return await sendRequest("/api/comments/add", "post", data)
  }

  static async deleteComment(commentId) {
    return await sendRequest("/api/comments/delete/" + commentId, "post");
  }

  static async deleteDepartment(departmentId) {
    return await sendRequest("/api/departments/delete/" + departmentId, "post");
  }

  static async getRoles(data, config) {
    return await sendRequest("/api/roles/", "get", data, config)
  }


  static async addRole(data) {
    return await sendRequest("/api/roles/add", "post", data)
  }

  static async deleteRole(roleId) {
    return await sendRequest("/api/roles/delete/" + roleId, 'post', {})
  }

  static async updateRole(roleId, data) {
    return await sendRequest("/api/roles/update/" + roleId, 'post', data)
  }

  static async getRole(roleId, config) {
    return await sendRequest("/api/roles/" + roleId, 'get', {}, config)
  }

  static async getUserByPermissions(data, config) {
    return await sendRequest("/api/roles/users", 'get', data, config)
  }

  static async getRequests(data, config) {
    return await sendRequest("/api/requests/", 'get', data, config)
  }

  static async getRequestsByCategory(category, data, config) {
    return await sendRequest("/api/requests/[placeholder]/" + category, 'get', data, config)
  }

  static async sendRequest(data) {
    return await sendRequest("/api/requests/add", "post", data)
  }

  static async deleteRequest(requestId) {
    return await sendRequest("/api/requests/delete/" + requestId, 'post', {})
  }

  static async updateRequest(requestId, data) {
    return await sendRequest("/api/requests/update/" + requestId, 'post', data)
  }

  static async getRequest(requestId, config) {
    return await sendRequest("/api/requests/" + requestId, 'get', config)
  }

  static async getRequestComment(requestId, data, config) {
    return await sendRequest("/api/requests/comments" + requestId, 'get', data, config)
  }

  static async getNotes(data, config) {
    return await sendRequest("/api/notes", "get", data, config);
  }

  static async getNote(noteId, config) {
    return await sendRequest("/api/notes" + noteId, "get", {}, config);
  }

  static async addNote(data) {
    return await sendRequest("/api/notes/add", "post", data);
  }

  static async deleteNote(noteId) {
    return await sendRequest("/api/notes/delete/" + noteId, 'post', {})
  }

  static async updateNote(data, noteId) {
    return await sendRequest("/api/notes/update/" + noteId, 'post', data)
  }

  static async getEvents(data, config) {
    return await sendRequest("/api/events", "get", data, config);
  }

  static async getEvent(eventId, data, config) {
    return await sendRequest("/api/events/" + eventId, "get", data, config);
  }

  static async addEvent(data) {
    return await sendRequest("/api/events/add", "post", data);
  }

  static async deleteEvent(eventId) {
    return await sendRequest("/api/events/delete/" + eventId, 'post', {})
  }

  static async updateNote(eventId, data) {
    return await sendRequest("/api/events/update/" + eventId, 'post', data)
  }

  static async getMemberOfEvent(eventId, data, config) {
    await sendRequest("/api/events/members/" + eventId, 'get', data, config)
  }

  static connectWithGoogle(data) {
    return sendRequest('/api/auth/connect-gg', 'post', data);
  }

  static connectWithFacebook(data) {
    return sendRequest('/api/auth/connect-fb', 'post', data);
  }

  static changePassword(id, data) {
    return sendRequest('/api/users/update/' + id, 'post', data);
  }

  static addBlog(data) {
    return sendRequest('/api/blogs/submit', 'post', data)
  }


  static addQuestion(data) {
    return sendRequest('/api/com-questions/submit', 'post', data);
  }

  static disconnectWakaTime() {
    return sendRequest('/api/users/wakatime-disconnect', 'post', {});
  }

  static getForecast(city = 'Hanoi', days = 7) {
    return new Promise((resolve, reject) => {
      sendRequest('/api/weather/getForecast', 'post', {
        city,
        days
      }).then(res => resolve(res)).catch(err => reject(err));
    });
  }

  // mailing apis
  static async getEmails() {
    try {
      return await sendRequest('/api/mail/load-mails', 'post', {});
    } catch (e) {
      return new Error("Unexpected error.");
    }
  }

  static async getEmail(mailId) {
    try {
      return await sendRequest('/api/mail/load-mail', 'post', {
        id: mailId
      });
    } catch (e) {
      return new Error("Unexpected error.");
    }
  }

  static sendEmail() {

  }

  static deleteEmail() {

  }
}

export default ApiService;
