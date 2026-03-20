package com.cyberseccourse.billingservice.repository;

import com.cyberseccourse.billingservice.dto.response.PageResponse;
import com.cyberseccourse.billingservice.entity.Brand;
import com.cyberseccourse.billingservice.entity.Category;
import com.cyberseccourse.billingservice.entity.Product;
import com.cyberseccourse.billingservice.repository.criteria.SearchCriteria;
import com.cyberseccourse.billingservice.repository.criteria.SearchQueryConsumer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Repository
public class SearchRepository {

    private static final Logger log = LoggerFactory.getLogger(SearchRepository.class);

    private final ProductRepository productRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public SearchRepository( ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
//
//    public PageResponse<?> searchingUserWithColumns(int pageNo, int pageSize, String search, String sortBy) {
//
//        StringBuilder sqlQuery = new StringBuilder("Select new com.example.unk_backend.dto.response.UserDetailResponse(u.id,u.firstName,u.lastName,u.email,u.phone) from User u where 1 = 1 ");
//
//        if (StringUtils.hasLength(search)) {
//            sqlQuery.append("and u.firstName like lower (:firstName) ");
//            sqlQuery.append("or u.lastName like lower(:lastName) ");
//            sqlQuery.append("or u.email like lower(:email) ");
//        }
//
//        //query ra count
//        StringBuilder sqlCountQuery = new StringBuilder("SELECT COUNT(*) from User u");
//
//        if (StringUtils.hasLength(search)) {
//            sqlCountQuery.append(" where lower(u.firstName) like lower(?1)");
//            sqlCountQuery.append(" or lower(u.lastName) like lower(?2)");
//            sqlCountQuery.append(" or lower(u.email) like lower(?3)");
//        }
//        Query CountQ = entityManager.createQuery(sqlCountQuery.toString());
//
//        //sortBy
//        Pageable pageable = PageRequest.of(pageNo, pageSize);
//        if (StringUtils.hasLength(sortBy)) {
//            Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)");
//            Matcher matcher = pattern.matcher(sortBy);
//            if (matcher.find()) {
//                sqlQuery.append(String.format("order by u.%s %s", matcher.group(1), matcher.group(3)));
//                sqlCountQuery.append(String.format("order by u.%s %s", matcher.group(1), matcher.group(3)));
//            }
//        }
//
//        Query query = entityManager.createQuery(sqlQuery.toString());
//        query.setFirstResult(pageNo);
//        query.setMaxResults(pageSize);
//        if (StringUtils.hasLength(search)) {
//            query.setParameter("firstName", String.format("%%%s%%", search));
//            query.setParameter("lastName", String.format("%%%s%%", search));
//            query.setParameter("email", String.format("%%%s%%", search));
//        }
//        List<UserDetailResponse> users = query.getResultList();
//
//        if (StringUtils.hasLength(search)) {
//            CountQ.setParameter(1, String.format("%%%s%%", search));
//            CountQ.setParameter(2, String.format("%%%s%%", search));
//            CountQ.setParameter(3, String.format("%%%s%%", search));
//        }
//        Long count = (Long) CountQ.getSingleResult();
//
//
//        Page<?> result = new PageImpl<>(users, pageable, users.size());
//
//        return PageResponse.builder()
//                .pageNo(pageNo)
//                .pageSize(pageSize)
//                .totalPages(result.getTotalPages())
//                .items(users)
//                .build();
//    }


    public PageResponse searchingProductWithMultipleColumns(int pageNo, int pageSize, String sortBy, String brandName, String categoryName, String... search) {
        //Xu ly search:
        List<SearchCriteria> orderColumn = new ArrayList<>();
        List<Product> result = new ArrayList<>();
        int pa  = 0;

        pa  = (pageNo > 0) ? pageNo - 1 :pa;

        Pageable page = PageRequest.of(pa,pageSize);

        if (search != null) {

            for (String s : search) {
                log.info("searching by creteria query");
                Pattern pattern = Pattern.compile("(\\w+?)(:|<|>)(.*)");
                Matcher matcher = pattern.matcher(s);
                if (matcher.find()) {
                    //todo
                    orderColumn.add(new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3)));
                }

            }
            result = getProducts(pageNo, pageSize, orderColumn, sortBy, brandName,categoryName);
        }
        //Number of records
        System.out.println(result.size());

        Page<Product> productPage = new PageImpl<>(result,page,result.size());

        List<Product> productList = productPage.stream().toList();

        return PageResponse.builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalPages((result.size() % pageSize  == 0) ? result.size() / pageSize : result.size() / pageSize +1)
                .items(productList)
                .build();
    }

    private List<Product> getProducts(int pageNo, int pageSize, List<SearchCriteria> orderColumn, String sortBy, String brand, String categoryName) {
        //tao builder
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        //Xac dinh kieu du lieu tra ve
        CriteriaQuery<Product> criteriaQuery = criteriaBuilder.createQuery(Product.class).distinct(true);
        //tao doi tuong truy van
        Root<Product> root = criteriaQuery.from(Product.class);
        //xu ly dieu kien tim kiem

        //tao predicate
        Predicate predicate = criteriaBuilder.conjunction();

        //truyen quaConsumer de ket hop nhieu predicate
        SearchQueryConsumer queryConsumer = new SearchQueryConsumer(criteriaBuilder, predicate, root);

        if (StringUtils.hasLength(brand)) {
            Join< Product, Brand> brandJoin = root.join("brand");

            Predicate addressPredicate = criteriaBuilder.like(brandJoin.get("brand_name"), "%" + brand + "%");

            predicate = criteriaBuilder.and(predicate,addressPredicate);

        }
        if(StringUtils.hasLength(categoryName))
        {
            Join< Product, Category> categoryJoin = root.join("category");

            Predicate categoryPredicate = criteriaBuilder.like(categoryJoin.get("category_name"), "%" + categoryName + "%");

            predicate = criteriaBuilder.and(predicate,categoryPredicate);
        }

            orderColumn.forEach(queryConsumer);

            predicate = criteriaBuilder.and(predicate, queryConsumer.getPredicate());

            criteriaQuery.where(predicate);


        //sort
        if (StringUtils.hasLength(sortBy)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(asc|desc)");
            Matcher matcher = pattern.matcher(sortBy);

            if (matcher.find()) {
                String columnRequest = matcher.group(1);
                if (matcher.group(3).equalsIgnoreCase("asc"))
                    criteriaQuery.orderBy(criteriaBuilder.asc(root.get(columnRequest)));
                else
                    criteriaQuery.orderBy(criteriaBuilder.desc(root.get(columnRequest)));
            }

        }
        int offset = (pageNo > 0 ? pageNo - 1 : 0) * pageSize;

        return entityManager.createQuery(criteriaQuery).setFirstResult(offset).setMaxResults(pageSize).getResultList();

    }
/*

* */

}
