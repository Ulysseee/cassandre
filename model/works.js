const WORKS = [
    {
        fields: {
            name: 'Appia',
            color: 'Beige',
            format: 'Horizontal',
            alignment: 'Gauche',
            coverImage: {
                fields: {
                    file: {
                        url: 'images/cover-appia.jpg',
                        description: 'cover du projet Appia',
                    }
                }
            }
        },
        metadata: {
            tags: [
                {
                    sys: {
                        id: 'Interactive',
                    }
                },
                {
                    sys: {
                        id: 'Branding',
                    }
                },
            ]
        },
        sys: {
            contentType: {
                sys: {
                    id: 'work'
                },
            },
        }
    },
    {
        fields: {
            name: 'Appia',
            color: 'Rouge',
            format: 'Vertical',
            alignment: 'Centre',
            coverImage: {
                fields: {
                    file: {
                        url: 'images/cover-musee.jpg',
                        description: 'cover du projet Appia',
                    }
                }
            }
        },
        metadata: {
            tags: [
                {
                    sys: {
                        id: 'Interactive',
                    }
                },
                {
                    sys: {
                        id: 'Branding',
                    }
                },
            ]
        },
        sys: {
            contentType: {
                sys: {
                    id: 'work'
                },
            },
        }
    },
    {
        fields: {
            name: 'Musée d\'art moderne et tout',
            color: 'Marron',
            format: 'Horizontal',
            alignment: 'Centre',
            coverImage: {
                fields: {
                    file: {
                        url: 'images/cover-appia.jpg',
                        description: 'cover du projet Appia',
                    }
                }
            }
        },
        metadata: {
            tags: [
                {
                    sys: {
                        id: 'Interactive',
                    }
                },
            ]
        },
        sys: {
            contentType: {
                sys: {
                    id: 'work'
                },
            },
        }
    },
];

module.exports = WORKS;
