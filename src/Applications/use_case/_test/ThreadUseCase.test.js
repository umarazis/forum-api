const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyDetail = require('../../../Domains/replies/entities/ReplyDetail');

describe('ThreadUseCase', () => {
  describe('ThreadUseCase addThread action', () => {
    it('should throw error if addThread params not contain needed parameter', async () => {
      // Arrange
      const useCasePayload = {};
      const addThreadUseCase = new ThreadUseCase({});

      // Action & Assert
      await expect(addThreadUseCase.addThread(useCasePayload, null))
        .rejects
        .toThrow('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    });

    it('should throw error when addThread params did not meet data type specification', async () => {
      // Arrange
      const useCasePayload = {};
      const threadUseCase = new ThreadUseCase({});

      // Action & Assert
      await expect(threadUseCase.addThread(useCasePayload, true))
        .rejects
        .toThrow('ADD_THREAD_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the addThread action correctly', async () => {
      // Arrange
      const useCasePayload = {
        title: 'title',
        body: 'body',
      };

      const mockAddedThread = new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123',
      });

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();

      /** mocking needed function */
      mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockAddedThread));

      /** creating use case instance */
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: {},
        replyRepository: {},
      });

      // Action
      const addedThread = await threadUseCase.addThread(useCasePayload, 'user-123');

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
      }));

      expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new AddThread({
        title: 'title',
        body: 'body',
      }), 'user-123');
    });
  });

  describe('ThreadUseCase getThread action', () => {
    it('should throw error if getThread params not contain needed parameter', async () => {
      // Arrange
      const threadUseCase = new ThreadUseCase({});

      // Action & Assert
      await expect(threadUseCase.getThread())
        .rejects
        .toThrow('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PARAMETER');
    });

    it('should throw error when getThread params did not meet data type specification', async () => {
      // Arrange
      const threadUseCase = new ThreadUseCase({});

      // Action & Assert
      await expect(threadUseCase.getThread(true))
        .rejects
        .toThrow('GET_THREAD_USE_CASE.PARAMETER_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the getThread action correctly', async () => {
      // Arrange
      const threadId = 'thread-123';

      const mockThreadDetail = new ThreadDetail({
        id: threadId,
        title: 'title',
        body: 'body',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [],
      });

      const comments = [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          deletedAt: null,
        },
        {
          id: 'comment-321',
          username: 'johndoe',
          date: '2022-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          deletedAt: '2022-08-09T07:22:33.555Z',
        }
      ];

      const replies = [
        {
          id: 'reply-123',
          username: 'johndoe',
          commentId: 'comment-123',
          date: '2021-08-09T07:22:33.555Z',
          content: 'sebuah balasan',
          deletedAt: null,
        },
        {
          id: 'reply-321',
          username: 'johndoe',
          commentId: 'comment-123',
          date: '2021-08-10T08:22:33.555Z',
          content: 'sebuah balasan',
          deletedAt: '2021-08-10T09:22:33.555Z',
        },
        {
          id: 'reply-1234',
          username: 'johndoe',
          commentId: 'comment-321',
          date: '2022-08-09T07:22:33.555Z',
          content: 'sebuah balasan',
          deletedAt: '2022-08-10T07:22:33.555Z',
        },
      ];

      /** creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /** mocking needed function */
      mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
      mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));
      mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(comments));
      mockReplyRepository.getRepliesByCommentIds = jest.fn(() => Promise.resolve(replies));

      /** creating use case instance */
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // Action
      const threadDetail = await threadUseCase.getThread(threadId);

      // Assert
      expect(threadDetail).toStrictEqual(new ThreadDetail({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          new CommentDetail({
            id: 'comment-123',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment',
            replies: [
              new ReplyDetail({
                id: 'reply-123',
                username: 'johndoe',
                date: '2021-08-09T07:22:33.555Z',
                content: 'sebuah balasan',
              }),
              new ReplyDetail({
                id: 'reply-321',
                username: 'johndoe',
                date: '2021-08-10T08:22:33.555Z',
                content: '**balasan telah dihapus**',
              }),
            ],
          }),
          new CommentDetail({
            id: 'comment-321',
            username: 'johndoe',
            date: '2022-08-08T07:22:33.555Z',
            content: '**komentar telah dihapus**',
            replies: [
              new ReplyDetail({
                id: 'reply-1234',
                username: 'johndoe',
                date: '2022-08-09T07:22:33.555Z',
                content: '**balasan telah dihapus**',
              }),
            ],
          }),
        ],
      }));

      expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
      expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
      expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-123');
      expect(mockReplyRepository.getRepliesByCommentIds).toHaveBeenCalledWith(['comment-123', 'comment-321']);
    });
  });
});
