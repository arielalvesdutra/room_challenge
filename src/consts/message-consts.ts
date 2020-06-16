export enum HomeConst {
  WELLCOME_MESSAGE = "Welcome to the room challenge!"
}

export enum UserConst {
  USER_CREATED_WITH_SUCCESS = "user inserted with success",
  USER_NOT_FOUND = "User not found!",
  USER_EXCLUDED_WITH_SUCCESS = "User excluded with success",
  USER_UPDATED_WITH_SUCCESS = "User updated with success"
}

export enum RoomConst {
  GUID_IS_MANDATORY = "The guid is mandatory!",
  ROOM_NOT_FOUND = "Room not found!",
  ROOM_HOST_CHANGED_WITH_SUCCESS = "Host changed with success!",
  ROOM_CREATED_WITH_SUCCESS = "Room created with success",
  USER_ADDED_TO_ROOM = "User added to the room!",
  USER_MUST_BE_IN_THE_TO_BECAME_HOST = "The user must be already in the room to became a host!",
  USER_REMOVED_FROM_THE_ROOM = "User removed from the room!"
}

export enum AuthConst {
  INVALID_TOKEN = "Invalid token",
  INVALID_USER_OR_PASSWORD = "Invalid user or password"
}

export enum ErrorConst {
  ERROR_400 = "something went wrong",
  ERROR_400_INVALID_REQUEST = "Invalid request",
  ERROR_403 = "You don't have permission to execute this action!",
  ERROR_AUTHORIZATION_HEADER_IS_REQUIRED = "Authorization header is required"
}
