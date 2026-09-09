'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from "@/assets/assets";
import { getProduct } from '@/services/product';
import { resolveImageUrl } from '@/services/api';
import Loading from '@/components/Loading';
import { useAppContext } from '@/context/AppContext';

const ProductView = () => {
  const { id } = useParams();
  const router = useRouter();
  const { products, currency } = useAppContext();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const found = products.find((item) => item.id === Number(id));
    if (found) {
      setProduct(found);
    }
  }, [id, products, router]);

  if (!product) return <Loading />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20">
      <div className="px-5 lg:px-16 xl:px-20">
        <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
          <Image
            src={resolveImageUrl(mainImage || product?.images?.[0]?.url) || assets.apple_earphone_image}
            alt="alt"
            className="w-full h-auto object-cover mix-blend-multiply"
            width={1280}
            height={720}
            unoptimized
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product?.images?.map((image) => (
            <div
              key={image.id}
              onClick={() => setMainImage(image.url)}
              className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
            >
              <Image
                src={resolveImageUrl(image.url)}
                alt="alt"
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col px-5 lg:px-0 max-w-2xl mx-auto">
        <h1 className="text-3xl font-medium text-gray-800/90 mb-4">{product.name}</h1>
        <p className="text-gray-600 mt-3">{product.description}</p>
        <p className="text-3xl font-medium mt-6">Sale price: ${product.offerPrice}</p>
        <p className="text-lg font-medium mt-6">Original price: ${product.price}</p>
        <p className="text-lg font-medium mt-6">Date posted: {product.date}</p>
        <hr className="bg-gray-600 my-6" />
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse w-full max-w-72">
            <tbody>
              <tr>
                <td className="text-gray-600 font-medium">Brand</td>
                <td className="text-gray-800/50 ">Generic</td>
              </tr>
              <tr>
                <td className="text-gray-600 font-medium">Color</td>
                <td className="text-gray-800/50 ">Multi</td>
              </tr>
              <tr>
                <td className="text-gray-600 font-medium">Category</td>
                <td className="text-gray-800">{product.category?.name}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default ProductView;
