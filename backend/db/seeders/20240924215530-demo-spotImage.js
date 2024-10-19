'use strict';

const { spotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await spotImage.bulkCreate([
    {
      spotId: 1,
      url: "https://media.istockphoto.com/id/476881195/photo/bay-bridge-and-san-francisco-skyline-at-sunset.jpg?s=612x612&w=0&k=20&c=dBeGdmYS8eOufXGT_YdRkuvKfLKUHFYwVaL9gHbkSXo=",
      preview: true
    },
    {
      spotId: 1,
      url: "https://www.civitatis.com/f/estados-unidos/san-francisco/tour-privado-san-francisco-589x392.jpg",
      preview: false
    },
    {
      spotId: 1,
      url: "https://www.innsf.com/wp-content/uploads/sites/20/Lombard_street_1270_561_s_c1_c_c.jpg",
      preview: false
    },
    {
      spotId: 1,
      url: "https://www.frbsf.org/wp-content/uploads/FRBSF_Home-Page_Background-Hero.jpg",
      preview: false
    },
    {
      spotId: 1,
      url: "https://miro.medium.com/v2/resize:fit:10944/1*1ULziAXpG8sW4cbtS2xLtA.jpeg",
      preview: false
    },
    {
      spotId: 2,
      url: "https://thumbs.dreamstime.com/b/arctodus-bear-goes-house-ai-generated-photo-k-portrait-front-view-hd-image-background-322967776.jpg",
      preview: true
    },
    {
      spotId: 2,
      url: "https://media.istockphoto.com/id/1304565142/photo/brown-grizzly-bear-widely-open-mouth-near-a-wooden-house-collage.jpg?s=612x612&w=0&k=20&c=k1KWZ8_q6MoNt7TWdenZEUy_bWm3Oh8S7Yp1RZgru0k=",
      preview: false
    },
    {
      spotId: 2,
      url: "https://media.istockphoto.com/id/1158669709/photo/brown-bear-zoo.jpg?s=612x612&w=0&k=20&c=Q1bzY7UWqptCUREK8laBOmgLuldmQVD4zg0PjHVzQbs=",
      preview: false
    },
    {
      spotId: 2,
      url: "https://media.istockphoto.com/id/930281710/photo/funny-black-bear-sleepng-in-bed.jpg?s=1024x1024&w=is&k=20&c=yVZn8huF1d0z3Zp0BEk1nw68mMuTtT7Gys8Rj7iqXLk=",
      preview: false
    },
    {
      spotId: 2,
      url: "https://media.istockphoto.com/id/486622825/photo/brown-bear-in-the-city.jpg?s=612x612&w=0&k=20&c=3qkXq1op9gsFblC8wsWhXf_nbO6idZS-JEG6h78JhoI=",
      preview: false
    },
    {
      spotId: 3,
      url: "https://cdn.mos.cms.futurecdn.net/6G3zytZksDfH8vvh32f3RP.jpg",
      preview: true
    },
    {
      spotId: 3,
      url: "https://i.pinimg.com/736x/63/66/8b/63668bcf6f5bfbc785a4b7757173d01f.jpg",
      preview: false
    },
    {
      spotId: 3,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3Zolu2HpYU6uEvIytkNxR27qkchiNx6TWGgOGw0wH43NCtb0tgMstG5sLizMgjA7wP98&usqp=CAU",
      preview: false
    },
    {
      spotId: 3,
      url: "https://i.guim.co.uk/img/media/ec06f22938d8b9946977dc3ee75806d7f7eb117c/0_0_3500_2333/master/3500.jpg?width=700&quality=85&auto=format&fit=max&s=fecca2791af37e6fc13225eee333d5a7",
      preview: false
    },
    {
      spotId: 3,
      url: "https://images.squarespace-cdn.com/content/v1/5cb43f48523958d6ab567825/1690655917452-ASBNIM82ZUYPSLQS1165/kokh-6.jpg",
      preview: false
    },
    {
      spotId: 4,
      url: "https://taharaa.com/wp-content/uploads/2023/10/things-to-do-in-estes-park-downtown.jpg",
      preview: true
    },
    {
      spotId: 4,
      url: "https://res.cloudinary.com/simpleview/image/upload/v1567025471/clients/estespark/n0mbdmwekzmnczhzel6h_816d47ca-b491-4e65-8776-a20a70763a17.jpg",
      preview: false
    },
    {
      spotId: 4,
      url: "https://media.istockphoto.com/id/896154790/photo/the-russian-bear-as-the-soccer-fan.jpg?s=1024x1024&w=is&k=20&c=izGgCKK85W60FM1RcmZPMbYQVLpzHW0jSYsanwBYB8I=",
      preview: false
    },
    {
      spotId: 4,
      url: "https://media.istockphoto.com/id/2160237967/photo/bears-inspecting-a-rental-cabin-in-gatlinburg-tn.jpg?s=1024x1024&w=is&k=20&c=_zSidbep0W7idX16moHRP9v4IekbImKyi-e0MqWO_Yc=",
      preview: false
    },
    {
      spotId: 4,
      url: "https://i.pinimg.com/736x/4b/c7/c3/4bc7c358a67cb74c7d1b4a5aee6a7652.jpg",
      preview: false
    },
    {
      spotId: 5,
      url: "https://swiftmedia.s3.amazonaws.com/mountain.swiftcom.com/images/sites/7/2024/06/25103747/IMG_6805-1024x768.jpg",
      preview: true
    },
    {
      spotId: 5,
      url: "https://ca-times.brightspotcdn.com/dims4/default/e94e287/2147483647/strip/true/crop/9220x6020+0+0/resize/1200x784!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F12%2F7d%2F309315be465e900201bb375ead04%2Fla-me-bear.jpg",
      preview: false
    },
    {
      spotId: 5,
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Downtown_Fort_Collins_Colorado.jpg/1200px-Downtown_Fort_Collins_Colorado.jpg",
      preview: false
    },
    {
      spotId: 5,
      url: "https://i0.wp.com/thedownlo.com/wp-content/uploads/2021/03/things-to-do-in-fort-collins.jpg?ssl=1",
      preview: false
    },
    {
      spotId: 5,
      url: "https://res.cloudinary.com/simpleview/image/upload/v1525808777/clients/fortcollinsco/Old_Town_Fort_Collins_from_sunset_lounge_27174f0c-e650-42b7-8840-2fa9bd375fd9.jpg",
      preview: false
    },
    {
      spotId: 6,
      url: "https://d1muy2ct2wkbaz.cloudfront.net/video/495000/494127/580x325/16.jpg",
      preview: true
    },
    {
      spotId: 6,
      url: "https://media.istockphoto.com/id/930281710/photo/funny-black-bear-sleepng-in-bed.jpg?s=1024x1024&w=is&k=20&c=yVZn8huF1d0z3Zp0BEk1nw68mMuTtT7Gys8Rj7iqXLk=",
      preview: false
    },
    {
      spotId: 6,
      url: "https://media.gettyimages.com/id/1210389201/photo/independence-monument-colorado-national-monument.jpg?s=612x612&w=gi&k=20&c=Y6jxOwNXmXowlDg6DzeBwh0ZKIAoG6FeGJQlzG-xOY0=",
      preview: false
    },
    {
      spotId: 6,
      url: "https://www.townofmonument.org/PhotoGallery/2/IMG_2866.jpg",
      preview: false
    },
    {
      spotId: 6,
      url: "https://www.townofmonument.org/PhotoGallery/2/IMG_2876.jpg",
      preview: false
    },
    {
      spotId: 7,
      url: "https://media.istockphoto.com/id/1384874822/photo/large-female-grizzly-bear-with-two-spring-cubs-next-to-cabin.jpg?s=612x612&w=0&k=20&c=3pddFj5LUiLUBqq1LQGqo8gd792UusrlIP5dX37Om4k=",
      preview: true,
    },
    {
      spotId: 7,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOaBSWCIAYDMG5tgj63BL8xjyn1RHFpTYaP-uZKkPwBkyHjIWZi-taJxArlbV_hvXfA18&usqp=CAU",
      preview: false,
    },
    {
      spotId: 7,
      url: "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/59000/59233-Santa-Cruz.jpg",
      preview: false,
    },
    {
      spotId: 7,
      url: "https://www.visittheusa.com/sites/default/files/styles/hero_l/public/images/hero_media_image/2016-10/HERO%201_Capitola%20Beach_shutterstock_271515587_Web72DPI.jpg?h=e8704342&itok=ZcpfFX6_",
      preview: false,
    },
    {
      spotId: 7,
      url: "https://redpawtechnologies.com/downloads/2020/04/SantaCruzCA.jpg",
      preview: false,
    },
    {
      spotId: 8,
      url: "https://c8.alamy.com/comp/JM543N/giant-teddy-bears-seated-in-rainbow-adirondack-chairs-on-sandy-beach-JM543N.jpg",
      preview: true,
    },
    {
      spotId: 8,
      url: "https://media.istockphoto.com/id/1020522918/photo/flic-en-flac-beach-with-piton-de-la-petite-riviere-noire-mauritius.jpg?s=612x612&w=0&k=20&c=tz74ZdQGEH19qFT5LIMKorHJKD1HoFIheli0eGiJOl4=",
      preview: false,
    },
    {
      spotId: 8,
      url: "https://media.gettyimages.com/id/1169718406/photo/aerial-view-of-le-morne-brabant-peninsula.jpg?s=612x612&w=gi&k=20&c=dqB5W5HNusgLhJl5U3ZVFNsqDpSqcGgcAuMhutV8jdE=",
      preview: false,
    },
    {
      spotId: 8,
      url: "https://www.nps.gov/glba/learn/nature/images/2BearBlack2_1.jpg?maxwidth=650&autorotate=false",
      preview: false,
    },
    {
      spotId: 8,
      url: "https://media-cdn.tripadvisor.com/media/photo-s/1b/78/c0/16/underwater-waterfall.jpg",
      preview: false,
    },
    ], options)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'spotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
