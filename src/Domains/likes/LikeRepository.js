/* eslint-disable no-unused-vars */
class LikeRepository {
    async addLike(owner, commentId) {
      throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  
    async deleteLike(owner, commentId) {
      throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  
    async getLikesByCommentId(commentId) {
      throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  }
  
  module.exports = LikeRepository;
  