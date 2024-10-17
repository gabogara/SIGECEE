const service = {
  getData: ({ from, to, datalist }) => {
    return new Promise((resolve, reject) => {
      const data = datalist.slice(from, to);
      resolve({
        count: datalist.length,
        data: data,
      });
    });
  },
};

export default service;
