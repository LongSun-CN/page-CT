export const environment = {
    production: false,
    hmr: false,
    basePath: '//localhost:8080/autotesting/',
    getUrl: (relativeUrl: string) => {
        return environment.basePath + relativeUrl;
    },
};
