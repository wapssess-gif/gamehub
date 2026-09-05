import type { GameStatus } from "@prisma/client";
import type { Locale } from "@/i18n/locale";

export type Dictionary = {
  nav: {
    catalog: string;
    library: string;
    people: string;
    friends: string;
    profile: string;
    logout: string;
    login: string;
    register: string;
  };
  home: {
    subtitle: string;
    myLibrary: string;
    start: string;
    browseCatalog: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    emailLabel: string;
    usernameLabel: string;
    passwordLabel: string;
    passwordHintLabel: string;
    loginSubmit: string;
    registerSubmit: string;
    pending: string;
    errors: {
      invalidEmail: string;
      usernameTooShort: string;
      usernameTooLong: string;
      usernameInvalidChars: string;
      passwordTooShort: string;
      invalidCredentials: string;
      accountExists: string;
      registeredButLoginFailed: string;
      invalidData: string;
      notAuthorized: string;
      entryNotFound: string;
    };
  };
  status: Record<GameStatus, string>;
  library: {
    title: string;
    addGameHeading: string;
    empty: string;
    percentPlaceholder: string;
    hoursPlaceholder: string;
    ratingPlaceholder: string;
    save: string;
    saved: string;
    remove: string;
    removeConfirm: string;
    unknownGenre: string;
    details: string;
  };
  search: {
    placeholder: string;
    searching: string;
    searchFailed: string;
    add: string;
    adding: string;
    addFailed: string;
    unknownDate: string;
    unknownGenre: string;
  };
  stats: {
    totalGames: string;
    hoursPlayed: string;
    averageRating: string;
    favoriteGenre: string;
    byStatus: string;
    empty: string;
  };
  profile: {
    statsHeading: string;
    avatarHeading: string;
    avatarHint: string;
    avatarUpload: string;
    avatarChange: string;
    avatarRemove: string;
    avatarProcessing: string;
    avatarSaved: string;
    privacyHeading: string;
    privacyPublic: string;
    privacyPrivate: string;
    privacyPublicHint: string;
    privacyPrivateHint: string;
    errors: {
      avatarMissing: string;
      avatarTooLarge: string;
      avatarBadType: string;
      avatarUploadFailed: string;
      avatarStorageDisabled: string;
    };
  };
  social: {
    searchTitle: string;
    searchPlaceholder: string;
    searchSubmit: string;
    searchHint: string;
    noUsersFound: string;
    follow: string;
    unfollow: string;
    addFriend: string;
    requestSent: string;
    cancelRequest: string;
    acceptRequest: string;
    declineRequest: string;
    youAreFriends: string;
    removeFriend: string;
    friends: string;
    followers: string;
    following: string;
    followsYou: string;
    privateBadge: string;
    privateProfileNotice: string;
    editProfile: string;
    viewPublicProfile: string;
    connectionsTitle: string;
    connectionsEmpty: string;
    findPeople: string;
    incomingRequests: string;
    outgoingRequests: string;
    emptyLibrary: string;
  };
  games: {
    title: string;
    searchPlaceholder: string;
    allGenres: string;
    allPlatforms: string;
    apply: string;
    unknownDate: string;
    unknownGenre: string;
    inLibrary: string;
    addToLibrary: string;
    loginToAdd: string;
    noResults: string;
    unavailable: string;
  };
  gameDetails: {
    backToLibrary: string;
    backToCatalog: string;
    about: string;
    info: string;
    releaseDate: string;
    genres: string;
    platforms: string;
    developers: string;
    publishers: string;
    metacritic: string;
    rating: string;
    averagePlaytime: string;
    hours: string;
    website: string;
    esrbRating: string;
    inLibraryStatus: string;
    notInLibrary: string;
    addToLibrary: string;
    loginToAdd: string;
    notes: string;
    notesPlaceholder: string;
    saveNotes: string;
    saved: string;
    saveChanges: string;
    unknown: string;
    notFound: string;
    notFoundDesc: string;
    addedOn: string;
    startedOn: string;
    finishedOn: string;
  };
};

const ru: Dictionary = {
  nav: {
    catalog: "Каталог",
    library: "Библиотека",
    people: "Люди",
    friends: "Друзья",
    profile: "Профиль",
    logout: "Выйти",
    login: "Войти",
    register: "Регистрация",
  },
  home: {
    subtitle:
      "Единая платформа для геймеров: библиотека игр, отслеживание прогресса, статистика и открытие новых игр.",
    myLibrary: "Моя библиотека",
    start: "Начать",
    browseCatalog: "Смотреть каталог",
  },
  auth: {
    loginTitle: "Вход",
    registerTitle: "Регистрация",
    emailLabel: "Email",
    usernameLabel: "Ник",
    passwordLabel: "Пароль",
    passwordHintLabel: "Пароль (мин. 8 символов)",
    loginSubmit: "Войти",
    registerSubmit: "Создать аккаунт",
    pending: "Подождите...",
    errors: {
      invalidEmail: "Некорректный email",
      usernameTooShort: "Ник — минимум 3 символа",
      usernameTooLong: "Ник — максимум 24 символа",
      usernameInvalidChars: "Только латиница, цифры и подчёркивание",
      passwordTooShort: "Пароль — минимум 8 символов",
      invalidCredentials: "Неверный email или пароль",
      accountExists: "Пользователь с таким email или ником уже существует",
      registeredButLoginFailed: "Аккаунт создан, но вход не удался — попробуйте войти вручную",
      invalidData: "Некорректные данные",
      notAuthorized: "Не авторизован",
      entryNotFound: "Запись не найдена",
    },
  },
  status: {
    WANT_TO_PLAY: "Хочу играть",
    PLAYING: "Играю",
    COMPLETED: "Пройдено",
    DROPPED: "Брошено",
    ON_HOLD: "На паузе",
  },
  library: {
    title: "Моя библиотека",
    addGameHeading: "Добавить игру",
    empty: "Пока пусто — найдите игру выше и добавьте её в библиотеку.",
    percentPlaceholder: "% прогресса",
    hoursPlaceholder: "часов",
    ratingPlaceholder: "оценка",
    save: "Сохранить",
    saved: "Сохранено",
    remove: "Удалить",
    removeConfirm: "Удалить «{title}» из библиотеки?",
    unknownGenre: "жанр неизвестен",
    details: "Подробнее",
  },
  search: {
    placeholder: "Найти игру по названию...",
    searching: "Поиск...",
    searchFailed: "Не удалось выполнить поиск. Попробуйте ещё раз.",
    add: "Добавить",
    adding: "Добавляю...",
    addFailed: "Не удалось добавить игру",
    unknownDate: "дата неизвестна",
    unknownGenre: "жанр неизвестен",
  },
  stats: {
    totalGames: "Всего игр",
    hoursPlayed: "Часов сыграно",
    averageRating: "Средняя оценка",
    favoriteGenre: "Любимый жанр",
    byStatus: "По статусам",
    empty: "Библиотека пуста",
  },
  profile: {
    statsHeading: "Статистика",
    avatarHeading: "Аватар",
    avatarHint: "JPG, PNG или WebP. Изображение будет уменьшено до 256×256.",
    avatarUpload: "Загрузить фото",
    avatarChange: "Изменить фото",
    avatarRemove: "Удалить",
    avatarProcessing: "Обработка…",
    avatarSaved: "Аватар обновлён",
    privacyHeading: "Приватность профиля",
    privacyPublic: "Публичный",
    privacyPrivate: "Приватный",
    privacyPublicHint: "Библиотеку и статистику видит любой зарегистрированный пользователь.",
    privacyPrivateHint: "Библиотеку и статистику видят только принятые друзья.",
    errors: {
      avatarMissing: "Файл не выбран.",
      avatarTooLarge: "Файл слишком большой.",
      avatarBadType: "Поддерживаются только JPG, PNG и WebP.",
      avatarUploadFailed: "Не удалось загрузить изображение. Попробуйте ещё раз.",
      avatarStorageDisabled:
        "Загрузка аватара недоступна: не настроен BLOB_READ_WRITE_TOKEN (см. .env.example).",
    },
  },
  social: {
    searchTitle: "Поиск пользователей",
    searchPlaceholder: "Введите ник (@username)…",
    searchSubmit: "Найти",
    searchHint: "Введите минимум 2 символа ника.",
    noUsersFound: "Пользователи не найдены.",
    follow: "Подписаться",
    unfollow: "Отписаться",
    addFriend: "Добавить в друзья",
    requestSent: "Запрос отправлен",
    cancelRequest: "Отменить",
    acceptRequest: "Принять",
    declineRequest: "Отклонить",
    youAreFriends: "Вы друзья",
    removeFriend: "Удалить из друзей",
    friends: "Друзья",
    followers: "Подписчики",
    following: "Подписки",
    followsYou: "подписан(а) на вас",
    privateBadge: "Приватный профиль",
    privateProfileNotice: "Профиль приватный. Добавьтесь в друзья, чтобы видеть библиотеку и статистику.",
    editProfile: "Редактировать профиль",
    viewPublicProfile: "Мой публичный профиль",
    connectionsTitle: "Друзья и подписки",
    connectionsEmpty: "У вас пока нет связей.",
    findPeople: "Найти людей",
    incomingRequests: "Входящие запросы",
    outgoingRequests: "Исходящие запросы",
    emptyLibrary: "Библиотека пуста.",
  },
  games: {
    title: "Каталог игр",
    searchPlaceholder: "Поиск по названию...",
    allGenres: "Все жанры",
    allPlatforms: "Все платформы",
    apply: "Применить",
    unknownDate: "дата неизвестна",
    unknownGenre: "жанр неизвестен",
    inLibrary: "В библиотеке",
    addToLibrary: "Добавить в библиотеку",
    loginToAdd: "Войдите, чтобы добавить в библиотеку",
    noResults: "Ничего не найдено.",
    unavailable: "Каталог недоступен: не настроен RAWG_API_KEY (см. .env.example).",
  },
  gameDetails: {
    backToLibrary: "← В библиотеку",
    backToCatalog: "← В каталог",
    about: "Об игре",
    info: "Информация",
    releaseDate: "Дата выхода",
    genres: "Жанры",
    platforms: "Платформы",
    developers: "Разработчики",
    publishers: "Издатели",
    metacritic: "Metacritic",
    rating: "Рейтинг RAWG",
    averagePlaytime: "Среднее время",
    hours: "ч.",
    website: "Официальный сайт",
    esrbRating: "Возрастной рейтинг",
    inLibraryStatus: "В вашей библиотеке",
    notInLibrary: "Этой игры нет в вашей библиотеке",
    addToLibrary: "Добавить в библиотеку",
    loginToAdd: "Войдите, чтобы добавить в библиотеку",
    notes: "Личные заметки",
    notesPlaceholder: "Напишите свои впечатления, мысли или заметки об игре...",
    saveNotes: "Сохранить заметки",
    saved: "Сохранено",
    saveChanges: "Сохранить изменения",
    unknown: "Не указано",
    notFound: "Игра не найдена",
    notFoundDesc: "К сожалению, запрошенная игра не найдена.",
    addedOn: "Добавлено в библиотеку:",
    startedOn: "Начато:",
    finishedOn: "Пройдено:",
  },
};

const en: Dictionary = {
  nav: {
    catalog: "Catalog",
    library: "Library",
    people: "People",
    friends: "Friends",
    profile: "Profile",
    logout: "Log out",
    login: "Log in",
    register: "Sign up",
  },
  home: {
    subtitle:
      "One platform for gamers: game library, progress tracking, stats, and discovering new games.",
    myLibrary: "My library",
    start: "Get started",
    browseCatalog: "Browse catalog",
  },
  auth: {
    loginTitle: "Log in",
    registerTitle: "Sign up",
    emailLabel: "Email",
    usernameLabel: "Username",
    passwordLabel: "Password",
    passwordHintLabel: "Password (min. 8 characters)",
    loginSubmit: "Log in",
    registerSubmit: "Create account",
    pending: "Please wait...",
    errors: {
      invalidEmail: "Invalid email",
      usernameTooShort: "Username must be at least 3 characters",
      usernameTooLong: "Username must be at most 24 characters",
      usernameInvalidChars: "Only Latin letters, digits and underscore",
      passwordTooShort: "Password must be at least 8 characters",
      invalidCredentials: "Invalid email or password",
      accountExists: "A user with this email or username already exists",
      registeredButLoginFailed: "Account created, but sign-in failed — please log in manually",
      invalidData: "Invalid data",
      notAuthorized: "Not authorized",
      entryNotFound: "Entry not found",
    },
  },
  status: {
    WANT_TO_PLAY: "Want to play",
    PLAYING: "Playing",
    COMPLETED: "Completed",
    DROPPED: "Dropped",
    ON_HOLD: "On hold",
  },
  library: {
    title: "My library",
    addGameHeading: "Add a game",
    empty: "Nothing here yet — find a game above and add it to your library.",
    percentPlaceholder: "% progress",
    hoursPlaceholder: "hours",
    ratingPlaceholder: "rating",
    save: "Save",
    saved: "Saved",
    remove: "Remove",
    removeConfirm: 'Remove "{title}" from your library?',
    unknownGenre: "genre unknown",
    details: "Details",
  },
  search: {
    placeholder: "Search for a game by title...",
    searching: "Searching...",
    searchFailed: "Search failed. Please try again.",
    add: "Add",
    adding: "Adding...",
    addFailed: "Failed to add game",
    unknownDate: "release date unknown",
    unknownGenre: "genre unknown",
  },
  stats: {
    totalGames: "Total games",
    hoursPlayed: "Hours played",
    averageRating: "Average rating",
    favoriteGenre: "Favorite genre",
    byStatus: "By status",
    empty: "Library is empty",
  },
  profile: {
    statsHeading: "Stats",
    avatarHeading: "Avatar",
    avatarHint: "JPG, PNG or WebP. The image will be resized to 256×256.",
    avatarUpload: "Upload photo",
    avatarChange: "Change photo",
    avatarRemove: "Remove",
    avatarProcessing: "Processing…",
    avatarSaved: "Avatar updated",
    privacyHeading: "Profile privacy",
    privacyPublic: "Public",
    privacyPrivate: "Private",
    privacyPublicHint: "Any registered user can see your library and stats.",
    privacyPrivateHint: "Only accepted friends can see your library and stats.",
    errors: {
      avatarMissing: "No file selected.",
      avatarTooLarge: "The file is too large.",
      avatarBadType: "Only JPG, PNG and WebP are supported.",
      avatarUploadFailed: "Could not upload the image. Please try again.",
      avatarStorageDisabled:
        "Avatar upload unavailable: BLOB_READ_WRITE_TOKEN is not configured (see .env.example).",
    },
  },
  social: {
    searchTitle: "Find people",
    searchPlaceholder: "Enter a username (@username)…",
    searchSubmit: "Search",
    searchHint: "Type at least 2 characters of a username.",
    noUsersFound: "No users found.",
    follow: "Follow",
    unfollow: "Unfollow",
    addFriend: "Add friend",
    requestSent: "Request sent",
    cancelRequest: "Cancel",
    acceptRequest: "Accept",
    declineRequest: "Decline",
    youAreFriends: "Friends",
    removeFriend: "Remove friend",
    friends: "Friends",
    followers: "Followers",
    following: "Following",
    followsYou: "follows you",
    privateBadge: "Private profile",
    privateProfileNotice: "This profile is private. Become friends to see the library and stats.",
    editProfile: "Edit profile",
    viewPublicProfile: "My public profile",
    connectionsTitle: "Friends & follows",
    connectionsEmpty: "You have no connections yet.",
    findPeople: "Find people",
    incomingRequests: "Incoming requests",
    outgoingRequests: "Outgoing requests",
    emptyLibrary: "Library is empty.",
  },
  games: {
    title: "Game catalog",
    searchPlaceholder: "Search by title...",
    allGenres: "All genres",
    allPlatforms: "All platforms",
    apply: "Apply",
    unknownDate: "release date unknown",
    unknownGenre: "genre unknown",
    inLibrary: "In library",
    addToLibrary: "Add to library",
    loginToAdd: "Log in to add to your library",
    noResults: "Nothing found.",
    unavailable: "Catalog unavailable: RAWG_API_KEY is not configured (see .env.example).",
  },
  gameDetails: {
    backToLibrary: "← Back to library",
    backToCatalog: "← Back to catalog",
    about: "About the game",
    info: "Information",
    releaseDate: "Release date",
    genres: "Genres",
    platforms: "Platforms",
    developers: "Developers",
    publishers: "Publishers",
    metacritic: "Metacritic",
    rating: "RAWG Rating",
    averagePlaytime: "Average playtime",
    hours: "hrs",
    website: "Official website",
    esrbRating: "Age rating",
    inLibraryStatus: "In your library",
    notInLibrary: "This game is not in your library",
    addToLibrary: "Add to library",
    loginToAdd: "Log in to add to your library",
    notes: "Personal notes",
    notesPlaceholder: "Write your impressions, thoughts or notes about the game...",
    saveNotes: "Save notes",
    saved: "Saved",
    saveChanges: "Save changes",
    unknown: "Not specified",
    notFound: "Game not found",
    notFoundDesc: "Sorry, the requested game could not be found.",
    addedOn: "Added to library:",
    startedOn: "Started:",
    finishedOn: "Completed:",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
