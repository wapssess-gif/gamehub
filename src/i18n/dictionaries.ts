import type { GameStatus } from "@prisma/client";
import type { Locale } from "@/i18n/locale";
import type { AchievementId } from "@/lib/achievements";

export type Dictionary = {
  nav: {
    catalog: string;
    library: string;
    feed: string;
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
    popularGames: string;
    latestAdditions: string;
    whyGamehub: string;
    gameLibrary: string;
    gameLibraryDesc: string;
    statistics: string;
    statisticsDesc: string;
    social: string;
    socialDesc: string;
    progress: string;
    progressDesc: string;
    discover: string;
    discoverDesc: string;
    minimalDesign: string;
    minimalDesignDesc: string;
    readyToStart: string;
    readyToStartDesc: string;
    createAccount: string;
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
    or: string;
    continueWithGoogle: string;
    errors: {
      invalidEmail: string;
      usernameTooShort: string;
      usernameTooLong: string;
      usernameInvalidChars: string;
      usernameTaken: string;
      passwordTooShort: string;
      invalidCredentials: string;
      accountExists: string;
      registeredButLoginFailed: string;
      oauthFailed: string;
      invalidData: string;
      notAuthorized: string;
      entryNotFound: string;
    };
  };
  onboarding: {
    title: string;
    subtitle: string;
    usernameLabel: string;
    submit: string;
    saving: string;
    allSet: string;
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
    displayNameHeading: string;
    displayNameLabel: string;
    displayNameHint: string;
    bioHeading: string;
    bioLabel: string;
    bioPlaceholder: string;
    bioHint: string;
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
    save: string;
    saving: string;
    saved: string;
    cancel: string;
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
    searchByHandle: string;
    searchByName: string;
    searchById: string;
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
  activity: {
    title: string;
    empty: string;
    addedGame: string;
    startedPlaying: string;
    completed: string;
    rated: string;
    reviewed: string;
  };
  reviews: {
    heading: string;
    none: string;
    writeHeading: string;
    ratingLabel: string;
    bodyLabel: string;
    bodyPlaceholder: string;
    submit: string;
    update: string;
    delete: string;
    saving: string;
    deleteConfirm: string;
    edited: string;
    loginToReview: string;
    addToDbHint: string;
    errorEmptyBody: string;
    errorBadRating: string;
    errorGameNotFound: string;
  };
  achievements: {
    heading: string;
    unlockedOn: string;
    locked: string;
    empty: string;
    activityVerb: string;
    items: Record<AchievementId, { name: string; description: string }>;
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
    screenshots: string;
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
  collections: {
    title: string;
    myCollections: string;
    create: string;
    createFirst: string;
    empty: string;
    noGames: string;
    browseGames: string;
    backToCollections: string;
    edit: string;
    name: string;
    description: string;
    creating: string;
  };
};

const ru: Dictionary = {
  nav: {
    catalog: "Каталог",
    library: "Библиотека",
    feed: "Лента",
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
    popularGames: "⭐ Популярные игры",
    latestAdditions: "🆕 Новые добавления",
    whyGamehub: "✨ Почему GameHub?",
    gameLibrary: "Библиотека игр",
    gameLibraryDesc: "Следите за всеми своими играми в одном месте",
    statistics: "Статистика",
    statisticsDesc: "Часы игры, оценки, любимые жанры",
    social: "Социум",
    socialDesc: "Найдите друзей и следите за их прогрессом",
    progress: "Прогресс",
    progressDesc: "Отмечайте процент завершения и часы игры",
    discover: "Открытие",
    discoverDesc: "Смотрите 800k+ игр из RAWG",
    minimalDesign: "Минималистичный дизайн",
    minimalDesignDesc: "Чистый интерфейс без лишнего",
    readyToStart: "Готовы начать?",
    readyToStartDesc: "Присоединитесь к тысячам геймеров, управляющих своими библиотеками на GameHub",
    createAccount: "Создать аккаунт",
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
    or: "или",
    continueWithGoogle: "Продолжить через Google",
    errors: {
      invalidEmail: "Некорректный email",
      usernameTooShort: "Ник — минимум 3 символа",
      usernameTooLong: "Ник — максимум 24 символа",
      usernameInvalidChars: "Только латиница, цифры и подчёркивание",
      usernameTaken: "Этот ник уже занят",
      passwordTooShort: "Пароль — минимум 8 символов",
      invalidCredentials: "Неверный email или пароль",
      accountExists: "Пользователь с таким email или ником уже существует",
      registeredButLoginFailed: "Аккаунт создан, но вход не удался — попробуйте войти вручную",
      oauthFailed: "Не удалось войти через Google",
      invalidData: "Некорректные данные",
      notAuthorized: "Не авторизован",
      entryNotFound: "Запись не найдена",
    },
  },
  onboarding: {
    title: "Выберите ник",
    subtitle: "Под этим ником вас будут находить другие. Сменить его потом нельзя.",
    usernameLabel: "Ник",
    submit: "Продолжить",
    saving: "Сохраняю…",
    allSet: "Всё готово, перенаправляем…",
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
    displayNameHeading: "Имя профиля",
    displayNameLabel: "Имя",
    displayNameHint: "Как тебя зовут? (1-50 символов)",
    bioHeading: "О себе",
    bioLabel: "Описание",
    bioPlaceholder: "Расскажи о себе, своих интересах или любимых жанрах…",
    bioHint: "Макс. 300 символов. Будет видно всем.",
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
    save: "Сохранить",
    saving: "Сохранение…",
    saved: "Сохранено",
    cancel: "Отмена",
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
    searchPlaceholder: "Введите запрос…",
    searchSubmit: "Найти",
    searchHint: "Введите запрос: минимум 2 символа для ника или имени, число для ID.",
    searchByHandle: "по @нику",
    searchByName: "по имени",
    searchById: "по ID",
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
  activity: {
    title: "Лента активности",
    empty: "Пока пусто. Подпишитесь на кого-нибудь или добавьте друзей — их активность появится здесь.",
    addedGame: "добавил(а) в библиотеку",
    startedPlaying: "начал(а) играть в",
    completed: "прошёл(а)",
    rated: "оценил(а) на {rating}/10",
    reviewed: "написал(а) отзыв на",
  },
  reviews: {
    heading: "Отзывы",
    none: "Пока нет отзывов.",
    writeHeading: "Ваш отзыв",
    ratingLabel: "Оценка (1–10)",
    bodyLabel: "Текст",
    bodyPlaceholder: "Что вы думаете об этой игре?",
    submit: "Опубликовать",
    update: "Обновить",
    delete: "Удалить",
    saving: "Сохраняю…",
    deleteConfirm: "Удалить ваш отзыв?",
    edited: "изменён",
    loginToReview: "Войдите, чтобы оставить отзыв.",
    addToDbHint: "Отзыв можно оставить после того, как игра попадёт в базу (её добавят в библиотеку).",
    errorEmptyBody: "Текст отзыва не может быть пустым",
    errorBadRating: "Оценка должна быть от 1 до 10",
    errorGameNotFound: "Игра не найдена",
  },
  achievements: {
    heading: "Достижения",
    unlockedOn: "получено",
    locked: "не получено",
    empty: "Пока нет достижений.",
    activityVerb: "получил(а) достижение",
    items: {
      first_game: { name: "Первая игра", description: "Добавь первую игру в библиотеку" },
      ten_games: { name: "Коллекционер", description: "10 игр в библиотеке" },
      librarian: { name: "Библиотекарь", description: "25 игр в библиотеке" },
      fifty_games: { name: "Архивариус", description: "50 игр в библиотеке" },
      bookworm: { name: "Книжный червь", description: "100 игр в библиотеке" },
      game_mogul: { name: "Игровой магнат", description: "250 игр в библиотеке" },
      bottomless_pocket: { name: "Бездонный карман", description: "500 игр в библиотеке" },
      good_start: { name: "Хорошее начало", description: "Добавь 5 игр в коллекции" },
      curated_shelf: { name: "Избранная полка", description: "Добавь 25 игр в коллекции" },
      first_completed: { name: "Пройдено!", description: "Пройди первую игру" },
      hooked: { name: "Втянулся", description: "Пройди 3 игры" },
      ten_completed: { name: "Марафонец", description: "Пройди 10 игр" },
      veteran: { name: "Ветеран", description: "Пройди 25 игр" },
      story_master: { name: "Повелитель сюжетов", description: "Пройди 50 игр" },
      gaming_machine: { name: "Игровая машина", description: "Пройди 100 игр" },
      ninja: { name: "Ниндзя", description: "Пройди игру менее чем за 5 часов" },
      epic_journey: { name: "Эпический поход", description: "Пройди игру, потратив более 50 часов" },
      first_steps: { name: "Первые шаги", description: "Залогируй 10 часов" },
      amateur: { name: "Любитель", description: "Залогируй 50 часов" },
      hundred_hours: { name: "Сотка", description: "Залогируй 100 часов" },
      devoted_fan: { name: "Преданный фанат", description: "Залогируй 250 часов" },
      no_sleep: { name: "Без сна и отдыха", description: "Залогируй 500 часов" },
      life_on_screen: { name: "Жизнь на экране", description: "Залогируй 1000 часов" },
      productivity_maniac: { name: "Маньяк продуктивности", description: "Проведи в одной игре более 100 часов" },
      first_rating: { name: "Судья", description: "Поставь оценку первой игре" },
      strict_judge: { name: "Строгий судья", description: "Поставь оценки 10 играм" },
      first_approval: { name: "Первое одобрение", description: "Поставь игре оценку 10/10" },
      total_smackdown: { name: "Разгром", description: "Поставь игре оценку 1/10" },
      first_review: { name: "Критик", description: "Напиши первый отзыв" },
      five_reviews: { name: "Обозреватель", description: "Напиши 5 отзывов" },
      film_critic: { name: "Кинокритик", description: "Напиши 10 отзывов" },
      community_voice: { name: "Голос сообщества", description: "Напиши 25 отзывов" },
      masters_pen: { name: "Перо мастера", description: "Напиши отзыв длиннее 500 символов" },
      new_horizon: { name: "Новый горизонт", description: "Собери игры хотя бы в 2 жанрах" },
      genre_explorer: { name: "Всеядный", description: "Игры в 5 разных жанрах" },
      explorer: { name: "Исследователь", description: "Игры в 10 разных жанрах" },
      jack_of_all_trades: { name: "Мастер на все руки", description: "Игры в 20 разных жанрах" },
      narrow_specialist: { name: "Узкий специалист", description: "Пройди 5 игр одного жанра" },
      trophy_collector: { name: "Коллекционер трофеев", description: "Получи 25 достижений" },
      gamehub_legend: { name: "Легенда GameHub", description: "Получи все остальные достижения" },
    },
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
    screenshots: "Скриншоты",
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
  collections: {
    title: "Коллекции",
    myCollections: "Мои коллекции",
    create: "Создать",
    createFirst: "Создать первую",
    empty: "У вас ещё нет коллекций",
    noGames: "В коллекции нет игр",
    browseGames: "Смотреть игры",
    backToCollections: "← Вернуться к коллекциям",
    edit: "Редактировать",
    name: "Название",
    description: "Описание",
    creating: "Создаю...",
  },
};

const en: Dictionary = {
  nav: {
    catalog: "Catalog",
    library: "Library",
    feed: "Feed",
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
    popularGames: "⭐ Popular Games",
    latestAdditions: "🆕 Latest Additions",
    whyGamehub: "✨ Why GameHub?",
    gameLibrary: "Game Library",
    gameLibraryDesc: "Track all your games in one place",
    statistics: "Statistics",
    statisticsDesc: "Hours played, ratings, favorite genres",
    social: "Social",
    socialDesc: "Find friends and follow their progress",
    progress: "Progress",
    progressDesc: "Mark completion % and playtime",
    discover: "Discover",
    discoverDesc: "Browse 800k+ games from RAWG",
    minimalDesign: "Minimal Design",
    minimalDesignDesc: "Clean interface, no clutter",
    readyToStart: "Ready to start?",
    readyToStartDesc: "Join thousands of gamers managing their libraries on GameHub",
    createAccount: "Create Account",
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
    or: "or",
    continueWithGoogle: "Continue with Google",
    errors: {
      invalidEmail: "Invalid email",
      usernameTooShort: "Username must be at least 3 characters",
      usernameTooLong: "Username must be at most 24 characters",
      usernameInvalidChars: "Only Latin letters, digits and underscore",
      usernameTaken: "That username is taken",
      passwordTooShort: "Password must be at least 8 characters",
      invalidCredentials: "Invalid email or password",
      accountExists: "A user with this email or username already exists",
      registeredButLoginFailed: "Account created, but sign-in failed — please log in manually",
      oauthFailed: "Google sign-in failed",
      invalidData: "Invalid data",
      notAuthorized: "Not authorized",
      entryNotFound: "Entry not found",
    },
  },
  onboarding: {
    title: "Pick a username",
    subtitle: "This is how others will find you. You can't change it later.",
    usernameLabel: "Username",
    submit: "Continue",
    saving: "Saving…",
    allSet: "All set, redirecting…",
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
    displayNameHeading: "Profile name",
    displayNameLabel: "Name",
    displayNameHint: "What's your name? (1-50 characters)",
    bioHeading: "About you",
    bioLabel: "Bio",
    bioPlaceholder: "Tell us about yourself, your interests, or favorite genres…",
    bioHint: "Max 300 characters. Visible to everyone.",
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
    save: "Save",
    saving: "Saving…",
    saved: "Saved",
    cancel: "Cancel",
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
    searchPlaceholder: "Enter a query…",
    searchSubmit: "Search",
    searchHint: "Enter a query: at least 2 characters for a handle or name, a number for an ID.",
    searchByHandle: "by @handle",
    searchByName: "by name",
    searchById: "by ID",
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
  activity: {
    title: "Activity feed",
    empty: "Nothing here yet. Follow someone or add friends — their activity will show up here.",
    addedGame: "added to library",
    startedPlaying: "started playing",
    completed: "completed",
    rated: "rated {rating}/10",
    reviewed: "reviewed",
  },
  reviews: {
    heading: "Reviews",
    none: "No reviews yet.",
    writeHeading: "Your review",
    ratingLabel: "Rating (1–10)",
    bodyLabel: "Text",
    bodyPlaceholder: "What do you think of this game?",
    submit: "Publish",
    update: "Update",
    delete: "Delete",
    saving: "Saving…",
    deleteConfirm: "Delete your review?",
    edited: "edited",
    loginToReview: "Log in to write a review.",
    addToDbHint: "You can review this game once it's in the database (added to someone's library).",
    errorEmptyBody: "Review text cannot be empty",
    errorBadRating: "Rating must be between 1 and 10",
    errorGameNotFound: "Game not found",
  },
  achievements: {
    heading: "Achievements",
    unlockedOn: "unlocked",
    locked: "locked",
    empty: "No achievements yet.",
    activityVerb: "unlocked the achievement",
    items: {
      first_game: { name: "First Game", description: "Add your first game to the library" },
      ten_games: { name: "Collector", description: "10 games in your library" },
      librarian: { name: "Librarian", description: "25 games in your library" },
      fifty_games: { name: "Archivist", description: "50 games in your library" },
      bookworm: { name: "Bookworm", description: "100 games in your library" },
      game_mogul: { name: "Game Mogul", description: "250 games in your library" },
      bottomless_pocket: { name: "Bottomless Pocket", description: "500 games in your library" },
      good_start: { name: "Good Start", description: "Add 5 games to collections" },
      curated_shelf: { name: "Curated Shelf", description: "Add 25 games to collections" },
      first_completed: { name: "Completed!", description: "Complete your first game" },
      hooked: { name: "Hooked", description: "Complete 3 games" },
      ten_completed: { name: "Marathoner", description: "Complete 10 games" },
      veteran: { name: "Veteran", description: "Complete 25 games" },
      story_master: { name: "Story Master", description: "Complete 50 games" },
      gaming_machine: { name: "Gaming Machine", description: "Complete 100 games" },
      ninja: { name: "Ninja", description: "Complete a game in under 5 hours" },
      epic_journey: { name: "Epic Journey", description: "Complete a game after 50+ hours" },
      first_steps: { name: "First Steps", description: "Log 10 hours" },
      amateur: { name: "Amateur", description: "Log 50 hours" },
      hundred_hours: { name: "The Ton", description: "Log 100 hours" },
      devoted_fan: { name: "Devoted Fan", description: "Log 250 hours" },
      no_sleep: { name: "No Sleep", description: "Log 500 hours" },
      life_on_screen: { name: "Life on Screen", description: "Log 1000 hours" },
      productivity_maniac: { name: "Productivity Maniac", description: "Spend 100+ hours in a single game" },
      first_rating: { name: "Judge", description: "Rate your first game" },
      strict_judge: { name: "Strict Judge", description: "Rate 10 games" },
      first_approval: { name: "First Approval", description: "Give a game a 10/10" },
      total_smackdown: { name: "Total Smackdown", description: "Give a game a 1/10" },
      first_review: { name: "Critic", description: "Write your first review" },
      five_reviews: { name: "Reviewer", description: "Write 5 reviews" },
      film_critic: { name: "Film Critic", description: "Write 10 reviews" },
      community_voice: { name: "Community Voice", description: "Write 25 reviews" },
      masters_pen: { name: "Master's Pen", description: "Write a review longer than 500 characters" },
      new_horizon: { name: "New Horizon", description: "Have games in at least 2 genres" },
      genre_explorer: { name: "Omnivore", description: "Games across 5 different genres" },
      explorer: { name: "Explorer", description: "Games across 10 different genres" },
      jack_of_all_trades: { name: "Jack of All Trades", description: "Games across 20 different genres" },
      narrow_specialist: { name: "Narrow Specialist", description: "Complete 5 games of one genre" },
      trophy_collector: { name: "Trophy Collector", description: "Unlock 25 achievements" },
      gamehub_legend: { name: "GameHub Legend", description: "Unlock every other achievement" },
    },
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
    screenshots: "Screenshots",
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
  collections: {
    title: "Collections",
    myCollections: "My Collections",
    create: "Create",
    createFirst: "Create your first",
    empty: "You don't have any collections yet",
    noGames: "No games in this collection yet",
    browseGames: "Browse games",
    backToCollections: "← Back to collections",
    edit: "Edit",
    name: "Name",
    description: "Description",
    creating: "Creating...",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
