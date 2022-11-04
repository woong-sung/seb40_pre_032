/* eslint-disable */
import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from 'react-query';
import { getQuestionById } from '../../utils/hooks/useQuestion';
import { deleteAnswerById } from '../../utils/hooks/useAnswer';
import elapsed from '../../utils/hooks/elapsed';
import { useRecoilValue } from 'recoil';
import authAtom from '../../_state/auth';

function AnswerUserInfo({ answerId }) {
	const auth = useRecoilValue(authAtom);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { questionId } = useParams();

	const currentUser = useQuery(['user'], () => {
		return axios.get(
			'http://cors-anywhere.herokuapp.com/http://ec2-43-201-80-20.ap-northeast-2.compute.amazonaws.com:8080/users/myPage',
			{
				headers: {
					accessToken: auth,
				},
			},
			{
				select: (data) => data.userId,
			},
		);
	});

	const data = getQuestionById(questionId);
	const answerData = data?.data.answers.find(
		(answer) => answer.answerId === answerId,
	);
	const deleteAnswer = deleteAnswerById(answerId);
	const currentUserId = currentUser.data.data.userId;

	const handleEdit = () => {
		if (auth === null) {
			alert('로그인 후 다시 시도해주세요.');
			navigate('/login');
		} else {
			navigate(`/answers/${answerId}/edit`, {
				state: {
					questionId,
				},
			});
		}
	};

	const handleDelete = () => {
		if (auth === null) {
			alert('로그인 후 다시 시도해주세요.');
			navigate('/login');
		} else {
			deleteAnswer.mutate(
				{ accessToken: auth },
				{
					onSuccess: () =>
						queryClient.invalidateQueries(['question', questionId]),
				},
			);
		}
	};

	return (
		<div className="mt-6 flex flex-row h-[50px]">
			<div className="w-[280px]">
				{currentUserId === answerData.owner.userId ? (
					<>
						<button
							className="mr-2 text-sm text-gray-500"
							type="button"
							onClick={handleEdit}
						>
							Edit
						</button>
						<button
							className="mr-2 text-sm text-gray-500"
							type="button"
							onClick={handleDelete}
						>
							Delete
						</button>
					</>
				) : null}
			</div>
			{/* 수정된 적 없으면 빈칸 */}
			<div className="w-[280px]">
				<button type="button" className="text-blue-500 text-sm">
					{/* edited (editedAt) ago */}
				</button>
			</div>
			<div className="w-[150px] px-2 py-1">
				<div className="text-gray-500 text-sm">
					asked {elapsed(answerData.creationDate)}
				</div>
				<div className="flex flex-row">
					<img
						className="h-[20px] w-[20px]"
						src={answerData.owner.profileImage}
					/>
					<span className="text-blue-500 text-sm ml-2">
						{answerData.owner.displayName}
					</span>
				</div>
			</div>
		</div>
	);
}

export default AnswerUserInfo;
