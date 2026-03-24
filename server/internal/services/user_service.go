package services

import (
	"errors"
	"net/http"
	"server/internal/dto"
	"server/internal/models"
	"server/internal/repositories"
	"gorm.io/gorm"
)

type UserService struct {
	userRepo *repositories.UserRepository
}

func NewUserService(userRepo *repositories.UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

func (us *UserService) GetAllUsers() (*dto.GetAllUsersResponse, *models.ErrorResponse) {
	response := &dto.GetAllUsersResponse{}

 queriedUsers, err := us.userRepo.GetAllUsers()
 if err != nil {
  return nil, &models.ErrorResponse{
   Code:    http.StatusInternalServerError,
   Message: "Internal Server Error",
  }
 }

 response.MapUsersResponse(queriedUsers)

 return response, nil
}

func (us *UserService) GetUser(userID uint) (*dto.UserResponse, *models.ErrorResponse) {
	response := &dto.UserResponse{}

	user, err := us.userRepo.FindById(userID)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &models.ErrorResponse{
				Code:    http.StatusNotFound,
				Message: "User Not Found",
			}
		}
		return nil, &models.ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: "Internal Server Error",
		}
	}

	response.MapUserResponse(user)

	return response, nil
}

func (us *UserService) DeleteUser(userId uint) *models.ErrorResponse {
	user, err := us.userRepo.FindById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &models.ErrorResponse{
				Code:    http.StatusNotFound,
				Message: "User not found",
			}
		}
		return &models.ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: "Internal Server Error",
		}
	}
	err = us.userRepo.DeleteUser(user.ID)
	if err != nil {
		return &models.ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: "Internal Server Error",
		}
	}

	return nil
}

func (us *UserService) CreateUser(createUserRequest *dto.CreateUserRequest) (*dto.CreateUserResponse, *models.ErrorResponse) {
	userResponse := &dto.CreateUserResponse{}

	errEmail := us.checkIfEmailExists(createUserRequest.Email)
	if errEmail != nil {
		return nil, errEmail
	}

	user := createUserRequest.ToUser()

	err := us.userRepo.Create(user)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: "Failed to create user",
		}
	}

	return userResponse.FromUser(user), nil
}

func (us *UserService) UpdateUser(userID uint, updateUserRequest *dto.UpdateUserRequest) *models.ErrorResponse {
	existingUser, err := us.userRepo.FindById(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &models.ErrorResponse{
				Code:    http.StatusNotFound,
				Message: "User not found",
			}
		}
		return &models.ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: "Internal Server Error",
		}
	}

	if updateUserRequest.Email != existingUser.Email {
		errEmail := us.checkIfEmailExists(updateUserRequest.Email)
		if errEmail != nil {
			return errEmail
		}
	}

	existingUser = updateUserRequest.ToUser()
	existingUser.ID = userID

	err = us.userRepo.Update(existingUser)

	if err != nil {
		return &models.ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: "Failed to update user",
		}
	}

	return nil
}

func (us *UserService) checkIfEmailExists(email string) *models.ErrorResponse {
	userWithEmail, err := us.userRepo.FindByEmail(email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return &models.ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: "Internal Server Error",
		}
	}
	if userWithEmail != nil {
		return &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "Email already in use",
		}
	}
	return nil
}