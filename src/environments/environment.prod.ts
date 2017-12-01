export const environment = {
    production: true,
    hmr: false,
    basePath: '//10.2.44.18:8082/autotesting/',
    getUrl: (relativeUrl: string) => {
        return environment.basePath + relativeUrl;
    },
};
