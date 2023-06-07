import {
    addWebsite,
    deleteWebsite,
    updateWebsite,
    AddWebsiteProps,
    DeleteWebsiteProps,
    UpdateWebsiteProps
} from "../app";

export const mutation = {
    addWebsite: async (props: AddWebsiteProps, context) => {
        return addWebsite(props);
    },
    deleteWebsite: async (props: DeleteWebsiteProps, context) => {
        return deleteWebsite(props);
    },
    updateWebsite: async (props: UpdateWebsiteProps, context) => {
        return updateWebsite(props);
    }
};