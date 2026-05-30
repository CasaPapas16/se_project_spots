import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "45b9d3fe-1801-414d-9383-20f51dd60d40",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    console.log(cards);
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    profileAvatarEl.src = user.avatar;

    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

//edit profile element
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = document.forms.editProfileForm;
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

//card form elements
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const addCardForm = document.forms.newPostForm;
const newPostSaveBtn = newPostModal.querySelector(".modal__save-btn");
const newPostImageLink = newPostModal.querySelector("#card-image-input");
const newPostCardCaption = newPostModal.querySelector("#card-caption-input");

//preview image
const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const closeButtons = document.querySelectorAll(".modal__close-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

//avatar form elements
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = document.forms.editAvatarForm;
const avatarSubmitBtn = avatarModal.querySelector(".modal__save-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const profileAvatarEl = document.querySelector(".profile__avatar");

//delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

let selectedCard, selectedCardId;

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
  window.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
  window.removeEventListener("click", handleOverlayClick);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt) {
  evt.target.classList.toggle("card__like-btn_active");
}

function handleImageClick(data) {
  previewImageEl.src = data.link;
  previewImageEl.alt = data.name;
  previewCaptionEl.textContent = data.name;
  openModal(previewModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-btn");
  const likeButton = cardElement.querySelector(".card__like-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  likeButton.addEventListener("click", handleLike);
  deleteButton.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data),
  );
  cardImageEl.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
  openModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  api
    .addNewCard({
      name: newPostCardCaption.value,
      link: newPostImageLink.value,
    })
    .then((inputValues) => {
      const cardElement = getCardElement(inputValues);
      cardsList.prepend(cardElement);

      disableButton(newPostSaveBtn, settings);
      closeModal(newPostModal);
      addCardForm.reset();
    })
    .catch(console.error);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error);
}

addCardForm.addEventListener("submit", handleAddCardSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
