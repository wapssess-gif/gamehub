import type { GameStatus } from "@prisma/client";
import type { Locale } from "@/i18n/locale";

export type Dictionary = {
  nav: {
    catalog: string;
    library: string;
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
};

const ru: Dictionary = {
  nav: {
    catalog: "Каталог",
    library: "Библиотека",
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
};

const en: Dictionary = {
  nav: {
    catalog: "Catalog",
    library: "Library",
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
};

export const dictionaries: Record<Locale, Dictionary> = { ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
