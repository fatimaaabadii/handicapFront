import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

const client = axios.create({
  // baseURL: "http://154.144.246.177:8031",
   baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            console.log('error 401');
        } if (error.response.status === 403) {
            console.log('error 403');
           deleteCookie('token');
           window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

client.interceptors.request.use(
    (config) => {
        const token = getCookie('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export const api = client;


export function getDelegations() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/province/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}
export function getBeneficiares() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/beneficiaire/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}


export function getCadres() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/fonctionnaire/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}

export function getDashboard() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/association/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}




export function getRegions() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/region/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}


export function getSpecialite() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/Specialite/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}


export function getProgrammes() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/Programme/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}

export function getEtablissement() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/Etablissement/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}


export const logout = async () => {
    deleteCookie("token"); // Delete token cookie
    // Additional logic for clearing user data, redirecting, etc.
    window.location.href = "/login";
  };
export function getAssociations() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/association/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}


export const getAssociationsById = async (id) => {
    const token = getCookie('token');
    const { data } = await api.get(`/association/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};
export const getAssociationsByDele = async (delegation) => {
    const token = getCookie('token');
    const { data } = await api.get(`/association/ByDelegation/${delegation}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};


export function getTypeHandicap() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/TypeHandicap/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}

export function getServices() {
    return async () => {
        // TODO checks and params to all custom hooks

        const token = getCookie('token');
        const { data } = await api.get('/Service/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}






export const getBeneByDele = async (province) => {
    const token = getCookie('token');
    const { data } = await api.get(`/beneficiaire/ByDelegation/${province}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};


export const getCadresByDele = async (province) => {
    const token = getCookie('token');
    const { data } = await api.get(`/fonctionnaire/ByDelegation/${province}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};




export function getUsers() {
    return async () => {

        const token = getCookie('token');
        const { data } = await api.get('/auth/getUsers', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}




const tokenPayload = async () => {
    const token = await getCookie('token');
    if (!token) return null;
    const payload = token?.split('.')[1];
    const decodedPayload = await atob(payload);
    const tokenPay = JSON.parse(decodedPayload);
    return tokenPay?.sub;
}
export function getCurrentUser() {
    return async () => {
        const email = await tokenPayload();
        if (!email) return null;
        const token = getCookie('token');
        const { data } = await api.get('/auth/email/' + email, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return data;
    };
}

