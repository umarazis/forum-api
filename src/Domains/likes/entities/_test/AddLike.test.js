const AddLike = require('../AddLike');

describe('AddLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddLike(payload)).toThrow('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };
    // Action and Assert
    expect(() => new AddLike(payload)).toThrow('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addLike object correctly', () => {
    // Arrange
    const payload = {
      content: 'content',
    };

    // Action
    const { content } = new AddLike(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
