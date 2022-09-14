export default /* css */ `
    /* Правки стилей под сохраненную страницу */
    .hero-source .hero-source {
        font-weight: 600;
        opacity: .7;
        text-decoration: none;
    }
    .hero-source .hero-source:hover {
        opacity: 1;
        text-decoration: underline;
    }

    /* Формирование описания курса + обложка курса */
    .course-wrap {
        justify-content: space-around;
    }
    .standard-title {
        margin-top: 40px;
        margin-bottom: 20px;
    }

    .course-wrap-side-left {
        width: 100%;
        flex: 100% 0 0;
        order: 2;
    }
    .course-wrap-description {
        max-width: none;
        cursor: auto;
    }
    .course-wrap-side-right {
        width: 50%;
        flex: 50% 0 0;
        order: 1;
    }
    .course-wrap-side-cover {
        width: 360px;
        max-width: 50%;
        height: 220px;
        order: 0;
    }
    .video_info {
        order: 3;
        width: 100%;
    }
    .video_info .lessons-item {
        cursor: default;
    }
    .materials_info {
        order: 4;
        width: calc(100% + 60px);
        margin: 40px -30px -30px -30px;
    }

    @media screen and (max-width: 767px) {
        .course-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .course-wrap-side-right {
            width: 100%;
        }
        .course-wrap-side-cover {
            width: 60%;
            height: auto;
            margin-bottom: 20px;
        }
        .standard-title {
            margin: 20px 0;
        }
    }
    @media screen and (max-width: 414px) {
        .course-wrap-side-left {
            margin-bottom: 10px;
        }
        .course-wrap-side-cover {
            width: 100%;
        }
        .course-box-item {
            flex: 100% 0 0;
            width: 100%;
        }
        .course-box-item:last-child {
            margin-bottom: 0;
        }
        #lessons-list {
            margin: 0 -30px;
            width: calc(100% + 60px);
        }
    }

    /* Растягивает список уроков на всю ширину контейнера */
    .main-content .player .player-right {
        max-width: none;
        flex-basis: auto;
        width: 100%;
    }

    [class^=icon-] {
        font-family: "ch";
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-esc:before {
        content: ""
    }

    .icon-logo:before {
        content: ""
    }

    .icon-arrow:before {
        content: ""
    }

    .icon-pen:before {
        content: ""
    }

    .icon-download:before {
        content: ""
    }

    .icon-language:before {
        content: ""
    }

    .icon-dislike:before {
        content: ""
    }

    .icon-like:before {
        content: ""
    }

    .icon-arrow-down:before {
        content: ""
    }

    .icon-check:before {
        content: ""
    }

    .icon-close:before {
        content: ""
    }

    .icon-calendar:before {
        content: ""
    }

    .icon-eye-close:before {
        content: ""
    }

    .icon-eye:before {
        content: ""
    }

    .icon-filter:before {
        content: ""
    }

    .icon-heart-full:before {
        content: ""
    }

    .icon-heart:before {
        content: ""
    }

    .icon-latter:before {
        content: ""
    }

    .icon-lesson:before {
        content: ""
    }

    .icon-search:before {
        content: ""
    }

    .icon-sort:before {
        content: ""
    }

    .icon-source:before {
        content: ""
    }

    .icon-star-full:before {
        content: ""
    }

    .icon-star:before {
        content: ""
    }

    .icon-success:before {
        content: ""
    }

    .icon-time:before {
        content: ""
    }

    .icon-user:before {
        content: ""
    }
`;
